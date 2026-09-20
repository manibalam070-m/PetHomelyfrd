import express from 'express';
import {
  getProducts, getProduct, getFeaturedProducts, getRelatedProducts,
  createProduct, updateProduct, deleteProduct,
} from '../controllers/productController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);

router.post('/', isAuthenticated, authorizeRoles('admin'), createProduct);
router.put('/:id', isAuthenticated, authorizeRoles('admin'), updateProduct);
router.delete('/:id', isAuthenticated, authorizeRoles('admin'), deleteProduct);

export default router;