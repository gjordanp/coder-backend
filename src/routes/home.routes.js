import {Router} from 'express';
import userModel from '../models/Users.js';
import {createHash, validatePassword} from '../utils/bcript.js';

const homeRouter = Router(); 

homeRouter.get('/', async (req, res) => {
    res.render('login')
});

homeRouter.post('/trylogin', async (req, res) => {
    //obtenemos datos de body
    const {email, password} = req.body;
    if(!email || !password){
        res.send("No se ingresaron todos los datos");
    }
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
    
});

export default homeRouter;