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

describe("Test Routes Products", async function (){
    this.timeout(8000);

    it('GET /api/products/  Get all products', async function () {
        const response = await request.get('/api/products/').set({session:{user:{role:'admin'}}});
        //console.log(response);
        // expect(response).to.be.eql('success');
        expect(response.header.location).to.be.eql('/api/products/');
        expect(response.statusCode).to.be.eql(302);
    });


});