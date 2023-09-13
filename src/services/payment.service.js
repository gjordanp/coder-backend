import Stripe from 'stripe';
import { options } from '../utils/commander.js';
import productService from './product.service.js';


const enviroment = options.mode
const domain = enviroment === 'production' ? 'https://flykite.azurewebsites.net' : `http://localhost:${process.env.PORT}`;


export default class PaymentService{
    constructor(){
        this.stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    };
    createPaymentIntent = async (data) => {
        const paymentIntent = await this.stripe.paymentIntents.create(data);
        return paymentIntent;
    }
    createCheckoutSession = async (cart) => {
        const items = await Promise.all(cart.products.map(async prod => {
            const product= await productService.findById(prod.id_prod);
            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.title,
                        images: [product.thumbnails[0]],
                    },
                    unit_amount: product.price * 100,
                },
                quantity: prod.quantity,
            }
        })); //promise all para que se resuelvan todas las promesas antes de seguir

        const session = await this.stripe.checkout.sessions.create({
            line_items: items,
            mode: 'payment',
            success_url: `${domain}/api/payments/success`,
            cancel_url: `${domain}/api/carts/${cart._id}`,
        });
        return session;
    }
}