import { expect } from "chai";
import supertest from "supertest";
import { options } from "../../src/utils/commander.js"
import mongoose from "mongoose";
import 'dotenv/config';
// import {} from "../setup.test.js"

const enviroment = options.mode
const domain = enviroment === 'production' ? 'https://flykite2.azurewebsites.net' : `http://localhost:${process.env.PORT}`;
const request = supertest(domain);

mongoose.connect(process.env.URL_MONGODB_ATLAS);



describe("Test Routes Carts", async function (){
    this.timeout(8000);

    before(async function () {
        const mockUser = {
            email:"adminCoder@coder.com",
            password: "adminCoder123"
        }
        await request.post('/api/sessions/trylogin').send(mockUser).set('session',{user:{role:'admin'}});//login with admin role
    });

    it('GET /api/carts/  Get all carts', async function () {
        const response = await request.get('/api/carts/');
        expect(response.statusCode).to.be.eql(200);
    });

    it('GET /api/carts/:id  Get cart by id', async function () {
        const response = await request.get('/api/carts/60d8d1e9b0f1d00b7c9c7f4c');
        expect(response.statusCode).to.be.eql(200);
    });

    let newCart = null;
    it('GET /api/carts/createcart  Create cart', async function () {
        const response = await request.get('/api/carts/createcart');
        newCart = response.body;
        //console.log(newCart);
        expect(response.statusCode).to.be.eql(200);
    });

    it('DELETE /api/carts/:id  Delete cart by id', async function () {

        //test route set
        const response = await request.delete(`/api/carts/${newCart._id}`);
        //test a route that requires admin role
        expect(response.statusCode).to.be.eql(200);
    });

    after(async function () {
        await request.get('/api/sessions/logout');
    });
});