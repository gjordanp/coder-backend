import { Router } from 'express';
import { getMockUsers, getUserById, getUsers, resetPassword, resetPasswordNewPass, setPasswordModifiable, changePremiumRole, upload } from '../controllers/user.controller.js';
import { docUploader, productUploader, profileUploader } from '../utils/multer.js';


const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/mockusers', getMockUsers);

userRouter.get('/:id', getUserById);

userRouter.get('/:id/resetpasswordnewpass', resetPasswordNewPass)
userRouter.post('/:id/resetpassword', resetPassword)

userRouter.get('/:id/setpasswordmodifiable', setPasswordModifiable)

userRouter.get('/premium/:id', changePremiumRole)

userRouter.post('/:id/upload/profile',profileUploader.single('profile'), upload);
userRouter.post('/:id/upload/product',productUploader.single('product'), upload);
userRouter.post('/:id/upload/document',docUploader.single('document'), upload);



export default userRouter;