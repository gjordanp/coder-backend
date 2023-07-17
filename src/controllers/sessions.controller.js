
import userService from '../services/user.service.js';
import CurrentUserDTO from '../persistencia/DTOs/currentUserDTO.js';


export const renderRegister = async (req, res) => {
    res.render('register')
}

export const tryRegister = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).render('errors', 'usuario no creado');
        }
        //Registro correcto, creamos un carrito vacio
        res.status(200).send({ status: "success", payload: req.user });
    } catch (error) {
        res.status(401).render('errors', { status: "error", message: "Error de Registro" });
    }
}

export const failregister = async (req, res) => {
    console.log(req);
    res.status(500).render('errors', { status: "error", message: "Error de Registro" });
}

export const logout = async (req, res) => {
    req.session.destroy();
    res.redirect('/');
}

export const login = async (req, res) => {
    res.render('login')
}

export const profile = async (req, res) => {
    if (!req.session.user) {
        res.redirect("/");
    }
    else {
        res.render('profile', { user: req.session.user })
    }
}

export const tryLogin = async (req, res) => {
    // //obtenemos datos de body
    // const {email, password} = req.body;
    // if(!email || !password){
    //     //res.send("No se ingresaron todos los datos");
    //     res.render('errors', {message: "No se ingresaron todos los inputs del formulario."});
    // }
    // else{
    //     const user=await userModel.findOne({email: email});
    //     if(user){//Si el usuario ya existe
    //         if(validatePassword(password, user.password)){
    //             req.session.user = user;
    //             res.redirect('api/products');
    //         }
    //         else{//Si la contraseña es incorrecta
    //             res.render('errors', {message: "Contraseña incorrecta."});
    //             //res.render('errors');
    //             //res.send("Contraseña incorrecta");
    //         }
    //     }
    //     else{//Si el usuario no existe
    //         res.render('errors', {message: "El email no existe."});
    //         //res.send("El usuario no existe");
    //     }
    // }
    try {
        if (!req.user) {
            return res.status(400).render('errors', req.message);
        }
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        }
        res.status(200).redirect('api/products');
    } catch (error) {
        res.status(401).render('errors', { status: "error", message: "Login Error" });
    }
}
export const faillogin = async (req, res) => {
    res.status(500).render('errors', { status: "error", message: "Credenciales Incorrectas" });
}

export const currentUser = async (req, res) => {
    try {
        return res.status(200).send(new CurrentUserDTO(req.user));
    } catch (error) {
        return res.status(500).send({ status: "error", message: "Error obteniendo current user" });
    }
}