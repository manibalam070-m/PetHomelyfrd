import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController.js';
import { isAuthenticated, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/', isAuthenticated, authorizeRoles('admin'), upload.single('image'), uploadImage);

export default router;