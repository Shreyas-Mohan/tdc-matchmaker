import express from 'express';
import { 
  getAllCustomers, 
  getCustomerById, 
  getPotentialMatches, 
  sendMatchAction,
  updateCustomerNotes 
} from '../controllers/customerController.js';

const router = express.Router();

router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);
router.get('/:id/matches', getPotentialMatches);
router.post('/:id/send-match', sendMatchAction);
router.put('/:id/notes', updateCustomerNotes);
export default router;