import express from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
} from '../controllers/leadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getLeads).post(protect, createLead);

router
  .route('/:id')
  .get(protect, getLead)
  .put(protect, updateLead)
  .delete(protect, deleteLead);

export default router;
