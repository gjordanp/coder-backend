import { Router } from 'express';
import { getMockUsers, getUserById, getUsers, resetPassword, resetPasswordNewPass, setPasswordModifiable, changePremiumRole, uploadToMongo } from '../controllers/user.controller.js';
import { multerUploader } from '../utils/multer.js';


const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/mockusers', getMockUsers);

userRouter.get('/:id', getUserById);

userRouter.get('/:id/resetpasswordnewpass', resetPasswordNewPass)

userRouter.post('/:id/resetpassword', resetPassword)

userRouter.get('/:id/setpasswordmodifiable', setPasswordModifiable)

userRouter.get('/premium/:id', changePremiumRole)

userRouter.post('/:id/documents',multerUploader.single('file'), uploadToMongo);


export default userRouter;