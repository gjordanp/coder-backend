import {Router} from 'express';
import { createCheckoutSession, successPayment, cancelPayment } from '../controllers/payment.controller.js';

const paymentRouter = Router();

//paymentRouter.post('/payment-intent', aa);

paymentRouter.get('/checkout-session', createCheckoutSession);

paymentRouter.get('/success', successPayment);

paymentRouter.get('/cancel', cancelPayment);

export default paymentRouter;
