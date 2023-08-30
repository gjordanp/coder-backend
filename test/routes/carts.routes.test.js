import {request, AdminCookie} from "../setup.test.js"
import {expect} from "chai"



describe("Test Routes Carts", async function (){

    it('GET /api/carts/  Get all carts', async function () {
        const response = await request.get('/api/carts/');

        //console.log(response.headers);
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
        const response = await request.delete(`/api/carts/${newCart._id}`).set('Cookie', `${AdminCookie.name}=${AdminCookie.value}`);//pasamos la cookie con la autenticacion
        expect(response.statusCode).to.be.eql(200);
    });

    after(async function () {
        await request.get('/api/sessions/logout');
    });
});