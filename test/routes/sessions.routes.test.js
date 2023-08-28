import { expect } from "chai";
import supertest from "supertest";
import { options } from "../../src/utils/commander.js"
import mongoose from "mongoose";
import 'dotenv/config';
import userModel from "../../src/persistencia/mongoDB/models/users.model.js";
// import {} from "../setup.test.js"

const enviroment = options.mode
const domain = enviroment === 'production' ? 'https://flykite2.azurewebsites.net' : `http://localhost:${process.env.PORT}`;
const request = supertest(domain);

mongoose.connect(process.env.URL_MONGODB_ATLAS);

describe("Test Routes Sessions", async function (){
   this.timeout(8000);

    it('POST /api/sessions/tryregister  Register Successfull', async function () {
        const mockUser = {
            first_name: "TestName",
            last_name: "TestLastName",
            email: "namelastname@test.cl",
            age: 20,
            password: "123456"
        }
        const response = await request.post('/api/sessions/tryregister').send(mockUser);
        // console.log(response.statusCode);
        // console.log(response.body);
        expect(response.statusCode).to.be.eql(200);
        await userModel.deleteOne({email: "namelastname@test.cl"})
    });

    it('POST /api/sessions/tryregister  Email already exists', async function () {
        const mockUser = {
            first_name: "TestName",
            last_name: "TestLastName",
            email: "gjordanp@gmail.com",
            age: 20,
            password: "123456"
        }
        const response = await request.post('/api/sessions/tryregister').send(mockUser);
        // console.log(response.statusCode);
        // console.log(response.body);
        expect(response.statusCode).to.be.eql(302);
    });

    it('POST /api/sessions/trylogin Login Success', async function () {
        const mockUser = {
            email:"adminCoder@coder.com",
            password: "adminCoder123"
        }
        const response = await request.post('/api/sessions/trylogin').send(mockUser);

        expect(response.statusCode).to.be.eql(303); //303 porque redirecciona a /api/products
    });

    it('POST /api/sessions/trylogin Login Wrong Password', async function () {
        const mockUser = {
            email:"adminCoder@coder.com",
            password: "blablabla"
        }
        const response = await request.post('/api/sessions/trylogin').send(mockUser);
        // console.log(response);
        // console.log(response.headers);
        expect(response.headers.location).to.be.eql('faillogin');
    });

    it('POST /api/sessions/trylogin Login Wrong email', async function () {
        const mockUser = {
            email:"z@z.cl",
            password: "blablabla"
        }
        const response = await request.post('/api/sessions/trylogin').send(mockUser);
        // console.log(response);
        // console.log(response.headers);
        expect(response.headers.location).to.be.eql('faillogin');
    });

    after(async function(){
        await mongoose.connection.close();
    });

})