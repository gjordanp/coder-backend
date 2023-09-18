import e from "express";
import userService from "../services/user.service.js";
import sendMail from "../utils/nodemailer.js"

export const getUsers = async (req, res) => {
    try {
        const users = await userService.findAll();
        res.status(200).json({status:'success', payload: users});
    } catch (error) {
        req.logger.error("Error en getUsers");
        res.status(500).json({status:'error', payload: error});
    }
}

export const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.findById(id);
        res.status(200).json({status:'success', payload: user});
    } catch (error) {
        req.logger.error("Error en getUserById");
        res.status(500).json({status:'error', payload: error});
    }
}

export const getMockUsers = async (req, res) => {
    try {
        const users = await userService.mockUsers(100);
        res.status(200).json({status:'success', payload: users});
    } catch (error) {
        req.logger.error("Error en getMockUsers");
        res.status(500).json({status:'error', payload: error});
    }
}

export const resetPasswordNewPass = async (req, res) => {
    res.render('resetpasswordnewpass', {id: req.params.id})
}

export const resetPassword = async (req, res) => {
    try {
        //get id from params
        const id = req.params.id;
        const user = await userService.findById(id);
        if (!user) {
            return res.status(400).send({ status: "error", message: "Email no registrado" });
        }
        if (user.passwordModifiableUntil < Date.now()) {
            req.logger.error({ status: "error", message: "El link ha caducado" });
            return res.render('resetpassword', { status: "error", message: "El link ha caducado" });
        }
        const newUser = await userService.resetPassword(user.email,req.body.password);//cambiamos la contraseña
        await setPasswordNotModifiable(newUser);//ponemos la contraseña como no modificable
        if (newUser instanceof Error) {
            return res.render('resetpasswordnewpass', { id:user._id, message: newUser});
        }
        const sentEmail = await sendMail(newUser.email, "Contraseña actualizada", "Su contraseña de flykite ha sido actualizada correctamente", "<h1>Contraseña Actualizada</h1>", null);
        if(!sentEmail){
            req.logger.error("Error enviando email de actualizacion de contraseña");
            return res.status(500).send({ status: "error", message: "Error enviando email de actualizacion de contraseña" });
        }
        req.logger.info("Email de actualizacion de contraseña enviado");
        return res.status(200).send({ status: "success", message: "Contraseña actualizada" });
    } catch (error) {
        req.logger.error(error);
        return res.status(500).send({ status: "error", message: "Error reseteando password" });
    }
}

export const setPasswordModifiable = async (req, res) => {
    try {
        const id = req.params.id;
        //Se define una duracion fecha actual + 1 hora
        const date = Date.now() + 3600000;
        const user = await userService.setPasswordModifiable(id, date);
        res.status(200).json({status:'success', payload: user});
    } catch (error) {
        req.logger.error("Error en setPasswordModifiable");
        res.status(500).json({status:'error', payload: error});
    }
}

const setPasswordNotModifiable = async (user) => {
    try {
        const newUser = await userService.setPasswordNotModifiable(user);
        return newUser;
    } catch (error) {
        return error
    }
}

export const changePremiumRole = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.findById(id);
        const containIdDoc = user.documents.find(doc => doc.name === "idDoc");
        const containAddressDoc = user.documents.find(doc => doc.name === "addressDoc");
        const containAccountDoc = user.documents.find(doc => doc.name === "accountDoc");
        if (user.role=="user" && (!containIdDoc || !containAddressDoc || !containAccountDoc)) {
            req.logger.error("Usuario no ha subido todos los documentos");
            return res.status(400).send({ status: "error", message: "Usuario no ha subido todos los documentos" });
        }
        const updatedUser = await userService.changePremiumRole(id);
        res.redirect('/api/users/edit');
        //res.status(200).json({status:'success', payload: updatedUser});
    } catch (error) {
        req.logger.error("Error en changePremiumRole");
        res.status(500).json({status:'error', payload: error});
    }
}

export const updateLastConnection = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.updateLastConnection(id);
        res.status(200).json({status:'success', payload: user});
    } catch (error) {
        req.logger.error("Error en updateLastConnection");
        res.status(500).json({status:'error', payload: error});
    }
}

export const uploadToMongo = async (req, res) => {
    try {
        if(!req.file) {
            req.logger.error("Error en upload");
            return res.status(500).json({status:'error', payload: "Error en upload"});
        }
        const body = req.body;//multipart/form-data entrega body vacio, por lo que se agrega un input de texto adicional con el nombre del documento
        const docName=Object.values(body)[0];
        const response = await userService.uploadDocument(req.params.id, req.file, docName);
        const user = await userService.findById(req.params.id);
        req.session.user=user;
        res.status(200).json({status:'success', payload: req.file});
    } catch (error) {
        req.logger.error("Error en upload");
        res.status(500).json({status:'error', payload: error});
    }
}

export const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService.deleteUser(id);
        res.status(200).json({status:'success', payload: user});
    } catch (error) {
        req.logger.error("Error en deleteUser");
        res.status(500).json({status:'error', payload: error});
    }
}

export const deleteUsers = async (req, res) => {
    try {
        const users = await userService.deleteUsers();
        res.status(200).json({status:'success', payload: users});
    } catch (error) {
        req.logger.error("Error en deleteUsers");
        res.status(500).json({status:'error', payload: error});
    }
}

export const deleteInactiveUsers = async (req, res) => {
    try {
        const users = await userService.deleteUsers();
        res.redirect('/api/users/edit');
    } catch (error) {
        req.logger.error("Error en deleteUsers");
        res.status(500).json({status:'error', payload: error});
    }
}

export const editUsers = async (req, res) => {
    try {
        if(!req.session.user) {
            req.logger.error("user not logged");
            return res.status(500).json({status:'error', payload: "user not logged"});
        }
        const users = await userService.findAll();
        res.status(200).render('users', {user:req.session.user, users:users});
    } catch (error) {
        req.logger.error("Error en editUsers");
        res.status(500).json({status:'error', payload: error});
    }
}