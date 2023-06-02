import {Router} from 'express';
import { renderRegister, tryRegister, logout, login, tryLogin } from '../controllers/sessions.controller.js';

const sessionRouter = Router(); 

//Ruta api/sessions
sessionRouter.get('/api/sessions/', renderRegister);

//Ruta api/sessions/tryregister
sessionRouter.post('/api/sessions/tryregister', tryRegister);

//logout
sessionRouter.get('/api/sessions/logout', logout);

sessionRouter.get('/', login);

sessionRouter.post('/trylogin', tryLogin);

export default sessionRouter;