import express from 'express';
import { processPayment, verifyPayment } from '../controllers/paymentController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/process', isAuthenticated, processPayment);
router.post('/verify', isAuthenticated, verifyPayment);
export default router;