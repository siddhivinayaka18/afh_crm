import express from 'express';
import { getAllUsers, createUser, updateUserStatus, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.use(protect); // All routes require authentication
router.use(adminOnly); // All routes require admin role

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id/status').put(updateUserStatus);
router.route('/:id').delete(deleteUser);

export default router;
