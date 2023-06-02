import {Router} from 'express';
import userModel from '../models/Users.js';
import {createHash, validatePassword} from '../utils/bcript.js';

const homeRouter = Router(); 


export default homeRouter;