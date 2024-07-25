import express from 'express';
import {
  test,
  updateUser,
  deleteUser,
  getUserById, // Import the getUserById function
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/', test);
router.get('/:id', getUserById); // Add this line for fetching a user by ID
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);

export default router;
