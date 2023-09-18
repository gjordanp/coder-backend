import { Router } from "express";
import {
  getMockUsers,
  getUserById,
  getUsers,
  resetPassword,
  resetPasswordNewPass,
  setPasswordModifiable,
  changePremiumRole,
  uploadToMongo,
  deleteUsers,
  editUsers,
  deleteUser,
  deleteInactiveUsers
} from "../controllers/user.controller.js";
import { multerUploader } from "../utils/multer.js";
import authz from "../middlewares/autorization.js";

const userRouter = Router();

userRouter.get("/", getUsers);

userRouter.get("/edit", authz("admin"), editUsers);

userRouter.get("/mockusers", getMockUsers);

userRouter.get("/:id", getUserById);

userRouter.get("/:id/resetpasswordnewpass", resetPasswordNewPass);

userRouter.post("/:id/resetpassword", resetPassword);

userRouter.get("/:id/setpasswordmodifiable", setPasswordModifiable);

userRouter.get("/premium/:id", changePremiumRole);

userRouter.post("/:id/documents", multerUploader.single("file"), uploadToMongo);

userRouter.delete("/", deleteUsers);

userRouter.get("/delete/inactive", deleteInactiveUsers);

userRouter.get("/delete/:id", authz("admin"), deleteUser);

export default userRouter;
