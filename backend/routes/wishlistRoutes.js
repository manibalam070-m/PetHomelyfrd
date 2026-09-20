import express from 'express';
import { getWishlist, toggleWishlist } from '../controllers/wishlistController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(isAuthenticated);
router.get('/', getWishlist);
router.post('/toggle', toggleWishlist);
export default router;