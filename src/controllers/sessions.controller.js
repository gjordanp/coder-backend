import userModel from '../models/Users.js';
import {createHash, validatePassword} from '../utils/bcript.js';

export const renderRegister = async (req, res) => {
    res.render('register')
}

export const tryRegister = async (req, res) => {
    // const {first_name, last_name, email, age, password} = req.body;
    // if (!first_name || !last_name || !email || !age || !password) {
    //     //Si no hay datos
    //     res.send("El usuario no contiene todos los datos requeridos");
    // }
    // else if(await userModel.findOne({email: email})){
    //     //Si el usuario ya existe
    //     res.send("El usuario ya existe");
    // }
    // else{
    //     const passwordHash = createHash(password);
    //     await userModel.create({
    //         first_name, 
    //         last_name,
    //         email, 
    //         age, 
    //         password:passwordHash
    //     });
    //     res.send("Usuario creado exitosamente");
    // }
    try {
        if(!req.user){
            return res.status(401).render('errors','usuario no creado');
        }
        res.status(200).send({status: "success", payload: req.user});
    } catch (error) {
        res.status(401).render('errors',{status: "error", message: "Register failed"});
    }
}

export const failregister = async (req, res) => {
    console.log(req);
    res.status(500).render('errors', {status: "error", message: req.done});
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
    else{
        res.render('profile', {user: req.session.user})
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
        if(!req.user){
            return res.status(400).render('errors',req.message);
        }
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        }
        res.status(200).redirect('api/products');
    } catch (error) {
        res.status(401).render('errors',{status: "error", message: error.message});
    }
}
export const faillogin = async (req, res) => {
    
    res.status(500).render('errors', req.message);
}
