import express from 'express';
import {
  createAppointment, getMyAppointments, getAllAppointments, updateAppointmentStatus,
} from '../controllers/appointmentController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createAppointment);
router.get('/my-appointments', isAuthenticated, getMyAppointments);
router.get('/admin/all', isAuthenticated, authorizeRoles('admin'), getAllAppointments);
router.put('/admin/:id', isAuthenticated, authorizeRoles('admin'), updateAppointmentStatus);

export default router;