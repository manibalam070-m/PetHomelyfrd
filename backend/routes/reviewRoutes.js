import express from 'express';
import { createReview, getProductReviews, deleteReview } from '../controllers/reviewController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();
router.get('/:id', getProductReviews);
router.post('/:id', isAuthenticated, createReview);
router.delete('/:productId/:id', isAuthenticated, authorizeRoles('admin'), deleteReview);
export default router;