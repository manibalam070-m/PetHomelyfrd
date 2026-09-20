import express from 'express';
import {
  createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus, deleteOrder,
} from '../controllers/orderController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', isAuthenticated, createOrder);
router.get('/my-orders', isAuthenticated, getMyOrders);
router.get('/:id', isAuthenticated, getOrder);

router.get('/admin/all', isAuthenticated, authorizeRoles('admin'), getAllOrders);
router.put('/admin/:id', isAuthenticated, authorizeRoles('admin'), updateOrderStatus);
router.delete('/admin/:id', isAuthenticated, authorizeRoles('admin'), deleteOrder);

export default router;