import mongoose from "mongoose";
import 'dotenv/config';
import { options } from "../src/utils/commander.js"
import supertest from "supertest"
import {app} from "../src/app.js";

const enviroment = options.mode
//const domain = enviroment === 'production' ? 'https://flykite.onrender.com' : `http://localhost:${process.env.PORT}`;
export const request = supertest(app);
//export const request = supertest('/');

export let AdminCookie=null; //exportamos cookie de session de usuario admin para test de rutas con autenticacion
before(async()=>{
    await mongoose.connect(process.env.URL_MONGODB_ATLAS);

    const mockUser = {
        email:"adminCoder@coder.com",
        password: "adminCoder123"
    }
    const response = await request.post('/api/sessions/trylogin').send(mockUser);
    const cookieHeader = response.headers['set-cookie'][0];
    //console.log(response.headers);
    AdminCookie = {
        name: cookieHeader.split('=')[0],
        value: cookieHeader.split('=')[1],
    }
})
// beforeEach(async()=>{
//     this.timeout(5000);
// })
after(async()=>{
    await mongoose.connection.close();
});


