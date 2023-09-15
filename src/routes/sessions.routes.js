import {Router} from 'express';
import { renderRegister, tryRegister,failregister, logout, login, tryLogin, faillogin, profile, currentUser, resetPasswordView, resetPasswordEmail } from '../controllers/sessions.controller.js';
import passport from 'passport';
import autorization from '../middlewares/autorization.js';

const sessionRouter = Router(); 

// -------------------------------------------------Login sin Passport -----------------------------------------------
//Ruta api/sessions
sessionRouter.get('/register', renderRegister);
sessionRouter.get('/resetpasswordview', resetPasswordView);
sessionRouter.post('/resetpasswordemail', resetPasswordEmail);


//Ruta api/sessions/tryregister
//sessionRouter.post('/api/sessions/tryregister', tryRegister);

//logout
sessionRouter.get('/logout', logout);

//Login
sessionRouter.get('/login', login);

//Try login
//sessionRouter.post('/trylogin', tryLogin);

//Profile
sessionRouter.get('/profile', profile);

// -------------------------------------------------Login con Passport -----------------------------------------------
//Ruta api/sessions
sessionRouter.post('/tryregister', passport.authenticate('register',{failureRedirect:'failregister'}),tryRegister);
sessionRouter.get('/failregister', failregister);

//Try login
sessionRouter.post('/trylogin',passport.authenticate('login',{failureRedirect:'faillogin'}), tryLogin);
sessionRouter.get('/faillogin', faillogin);

//Github
sessionRouter.get('/google', 
    (req,res,next)=>passport.authenticate('google',{scope:['email','profile'],callbackURL:`http://${req.get('host')}/api/sessions/googlecallback`})(req,res,next));
sessionRouter.get('/googlecallback', 
    (req,res,next)=>passport.authenticate('google',{failureRedirect:'/faillogin',callbackURL:`http://${req.get('host')}/api/sessions/googlecallback`})(req,res,next),
    (req,res)=>{
    req.session.user = req.user;
    res.redirect('/api/products');
});

// Google
sessionRouter.get('/github', (req,res,next)=>passport.authenticate('github',{scope:['user:email'],callbackURL:`http://${req.get('host')}/api/sessions/githubcallback`})(req,res,next),async (req,res)=>{});
sessionRouter.get('/githubcallback', 
    (req,res,next)=>passport.authenticate('github',{failureRedirect:'/faillogin',callbackURL:`http://${req.get('host')}/api/sessions/githubcallback`})(req,res,next),
    async (req,res)=>{
    req.session.user = req.user;
    res.redirect('/api/products');
});

//Current user
sessionRouter.get('/current',autorization('user'), currentUser);


export default sessionRouter;