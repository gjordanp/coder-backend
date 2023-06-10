import passport from "passport";
import local from "passport-local";
import userModel from "../models/Users.js";
import { createHash, validatePassword } from "../utils/bcript.js";

const LocalStrategy = local.Strategy;
const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            //passReqToCallback permite pasar el request al callback
            const { first_name, last_name, email, age } = req.body;
            try {
                const user = await userModel.findOne({ email: username });
                //Si el usuario existe, retornamos false, y un mensaje (No es un error, por eso el primer parametro es null)
                if (user) {
                    return done(null, false, { message: "El usuario ya existe" });
                }
                const newUser = new userModel({
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                });
                const createdUser = await userModel.create(newUser);
                //Si todo sale bien, retornamos el usuario creado
                return done(null, createdUser);
            } catch (error) {
                return done("Error al obtener el usuario: " + error);
            }

        }));

    //Inicializamos la sesion del usuario
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    //Obtener la sesion del usuario
    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    });

    passport.use('login', new LocalStrategy({usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username });
            if (!user) {//Usuario no encontrado
                return done(null, false, { message: "El usuario no existe" });
            }
            if (validatePassword(password, user.password)) {//Contraseña correcta
                return done(null, user, { message: "Login exitoso" });
            }
            //Contraseña incorrecta
            return done(null, false, { message: "Contraseña incorrecta" });
        } catch (error) {
            return done(error);
        }
    }));
};

export default initializePassport;