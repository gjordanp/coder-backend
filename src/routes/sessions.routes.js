import {Router} from 'express';
import userModel from '../models/Users.js';
import {createHash, validatePassword} from '../utils/bcript.js';

const sessionRouter = Router(); 

//Ruta api/sessions
sessionRouter.get('/', async (req, res) => {
     res.render('register')
});

//Ruta api/sessions/tryregister
sessionRouter.post('/tryregister', async (req, res) => {
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
});

//logout
sessionRouter.get('/logout', async (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

export default sessionRouter;