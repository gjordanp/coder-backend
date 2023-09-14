import {Router} from 'express';
import { createCheckoutSession, successPayment } from '../controllers/payment.controller.js';

const paymentRouter = Router();

//paymentRouter.post('/payment-intent', aa);

paymentRouter.get('/checkout-session', createCheckoutSession);

paymentRouter.get('/success', successPayment);

export default paymentRouter;
