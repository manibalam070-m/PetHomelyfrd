import express from 'express';
import {
  register, login, logout, getMe, updateProfile, updatePassword,
  forgotPassword, resetPassword, getAllUsers, updateUserRole, deleteUser,
} from '../controllers/authController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', isAuthenticated, getMe);
router.put('/me/update', isAuthenticated, updateProfile);
router.put('/password/update', isAuthenticated, updatePassword);
router.post('/password/forgot', forgotPassword);
router.put('/password/reset/:token', resetPassword);

// Admin
router.get('/admin/users', isAuthenticated, authorizeRoles('admin'), getAllUsers);
router.put('/admin/user/:id', isAuthenticated, authorizeRoles('admin'), updateUserRole);
router.delete('/admin/user/:id', isAuthenticated, authorizeRoles('admin'), deleteUser);

export default router;