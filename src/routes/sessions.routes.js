import {Router} from 'express';
import { renderRegister, tryRegister,failregister, logout, login, tryLogin, faillogin, profile } from '../controllers/sessions.controller.js';
import passport from 'passport';

const sessionRouter = Router(); 

// -------------------------------------------------Login sin Passport -----------------------------------------------
//Ruta api/sessions
sessionRouter.get('/api/sessions/', renderRegister);

//Ruta api/sessions/tryregister
//sessionRouter.post('/api/sessions/tryregister', tryRegister);

//logout
sessionRouter.get('/api/sessions/logout', logout);

//Login
sessionRouter.get('/', login);

//Try login
//sessionRouter.post('/trylogin', tryLogin);

//Profile
sessionRouter.get('/api/sessions/profile', profile);

// -------------------------------------------------Login con Passport -----------------------------------------------
//Ruta api/sessions
sessionRouter.post('/api/sessions/tryregister', passport.authenticate('register',{failureRedirect:'/api/sessions/failregister',failureMessage: true}),tryRegister);
sessionRouter.get('/api/sessions/failregister', failregister);

//Try login
sessionRouter.post('/trylogin',passport.authenticate('login',{failureRedirect:'/api/sessions/faillogin' , failureMessage: true}), tryLogin);
sessionRouter.get('/api/sessions/faillogin', faillogin);

// github
sessionRouter.get('/api/sessions/github', passport.authenticate('github',{scope:['user:email']}),async (req,res)=>{});
sessionRouter.get('/api/sessions/githubcallback', passport.authenticate('github',{failureRedirect:'/'}),async (req,res)=>{
    req.session.user = req.user;
    res.redirect('/api/sessions/profile');
});

export default sessionRouter;