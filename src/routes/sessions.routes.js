import {Router} from 'express';
import { renderRegister, tryRegister, logout, login, tryLogin, profile } from '../controllers/sessions.controller.js';

const sessionRouter = Router(); 

//Ruta api/sessions
sessionRouter.get('/api/sessions/', renderRegister);

//Ruta api/sessions/tryregister
sessionRouter.post('/api/sessions/tryregister', tryRegister);

//logout
sessionRouter.get('/api/sessions/logout', logout);

//Login
sessionRouter.get('/', login);

//Try login
sessionRouter.post('/trylogin', tryLogin);

//Profile
sessionRouter.get('/api/sessions/profile', profile);

export default sessionRouter;