import passport from "passport";
import local from "passport-local";
import gitHubStrategy from "passport-github2";
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

    passport.use('github',new gitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile);
            const user = await userModel.findOne({email: profile._json.email});
            if(!user){ //Si el usuario no existe, lo crea
                const newUser = new userModel({
                    first_name: profile._json.name,
                    last_name: '',
                    age: 0,
                    email: profile._json.email,
                    password: ''
                });
                const createdUser = await userModel.create(newUser);
                return done(null, createdUser);
            }
            else{//Si el usuario ya existe, retorna el usuario
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));
};

export default initializePassport;