import {Router} from 'express';
import userModel from '../models/Users.js';
import {createHash, validatePassword} from '../utils/bcript.js';
import { get } from 'mongoose';

const homeRouter = Router(); 

homeRouter.get('/', async (req,res)=>{
    if (!req.session.user) {
        res.redirect("/api/sessions/login");
    }
    else{
        res.render('home')
    }
})

export default homeRouter;