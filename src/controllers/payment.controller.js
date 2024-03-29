import cartService from "../services/cart.service.js";
import PaymentService from "../services/payment.service.js";
import sendMail from "../utils/nodemailer.js";

export const createCheckoutSession = async (req, res) => {
    try {
        const cartId = req.session.user.cart.id_cart;
        const paymentService = new PaymentService();
        const {ticket} = req.session.purchase;
        //const customer = await paymentService.createCustomer(ticket);
        const checkoutSession = await paymentService.createCheckoutSession(ticket);
        res.redirect(303, checkoutSession.url);
        //res.json(paymentIntent);
    } catch (error) {
        res.status(400).json({ error: { message: error.message } });
    }
};

export const successPayment = async (req, res) => {
    try {
        const {ticket} = req.session.purchase;
        sendMail(
            req.user.email, 
            `Confirmacion de compra #${ticket.code}`, 
            "Compra efectuada exitosamente", 
            `<h1>Hemos confirmado tu compra</h1>
            <h3>El total de tu compra es de $${ticket.amount}</h3>
            <h3>Los productos que compraste son:</h3>
            <ul>
                ${ticket.products.map(product => `<li>${product.id_prod} - ${product.quantity} unidades</li>`)}
            </ul>
            <h3>Gracias por tu compra</h3>`, 
            null
        );
        res.render('successcheckout', {user: req.session.user})
    } catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
}

export const cancelPayment = async (req, res) => {

    try {
        const beforePurchaseCart= req.session.beforePurchaseCart
        const cartId = req.session.user.cart.id_cart;
        //update cart with previous to payment
        const filter= { _id: cartId };
        const update = { products: beforePurchaseCart.products }
        const options = { new: true };
        const newCart = await cartService.findOneAndUpdate(filter,update,options)
        res.redirect(`/api/carts/${cartId}`)
        
    } catch (error) {
        res.status(500).json({ error: { message: error.message } });
    }
}
