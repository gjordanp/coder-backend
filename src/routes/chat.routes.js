import { Router } from "express";
import { getChat } from "../controllers/chat.controller.js";
import { get } from "mongoose";

const chatRouter = Router(); //Router para manejo de rutas

chatRouter.get('/', getChat);

export default chatRouter;