import userModel from '../models/Users.js';
import {createHash, validatePassword} from '../utils/bcript.js';

export const renderRegister = async (req, res) => {
    res.render('register')
}

export const tryRegister = async (req, res) => {
    const {first_name, last_name, email, age, password} = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
        //Si no hay datos
        res.send("El usuario no contiene todos los datos requeridos");
    }
    else if(await userModel.findOne({email: email})){
        //Si el usuario ya existe
        res.send("El usuario ya existe");
    }
    else{
        const passwordHash = createHash(password);
        await userModel.create({
            first_name, 
            last_name,
            email, 
            age, 
            password:passwordHash
        });
        res.send("Usuario creado exitosamente");
    }
}

export const logout = async (req, res) => {
    req.session.destroy();
    res.redirect('/');
}

export const login = async (req, res) => {
    res.render('login')
}

export const tryLogin = async (req, res) => {
    //obtenemos datos de body
    const {email, password} = req.body;
    if(!email || !password){
        res.send("No se ingresaron todos los datos");
    }
    else{
        const user=await userModel.findOne({email: email});
        if(user){//Si el usuario ya existe
            if(validatePassword(password, user.password)){
                req.session.user = user;
                res.redirect('api/products');
            }
            else{//Si la contraseña es incorrecta
                res.send("Contraseña incorrecta");
            }
        }
        else{//Si el usuario no existe
            res.send("El usuario no existe");
        }
    }
}