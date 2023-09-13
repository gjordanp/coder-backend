import cartService from "../services/cart.service.js";
import PaymentService from "../services/payment.service.js";

export const createCheckoutSession = async (req, res) => {
    try {
        const user = req.user;
        const cart = await cartService.findById(user.cart.id_cart);
        const paymentService = new PaymentService();
        // const paymentIntent = await paymentService.createPaymentIntent({
        //     amount,
        //     currency,
        // });
        const paymentIntent = await paymentService.createCheckoutSession(cart);
        res.redirect(303, paymentIntent.url);
        //res.json(paymentIntent);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: { message: error.message } });
    }
};
