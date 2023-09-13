import {Router} from 'express';
import PaymentService from '../services/payment.service.js';
import { createCheckoutSession } from '../controllers/payment.controller.js';

const paymentRouter = Router();

//paymentRouter.post('/payment-intent', aa);

paymentRouter.post('/checkout-session', createCheckoutSession);

paymentRouter.get('/success', async (req, res) => {res.render('successcheckout', {user: req.session.user})});

paymentRouter.get('/cancel', async (req, res) => {res.send('Cancelled')});

export default paymentRouter;
