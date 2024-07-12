import express from 'express';
import { createClub, deleteClub, updateClub, getClub, getClubs } from '../controllers/club.controller.js';
import { verifyToken, verifyAdmin } from '../utils/verifyUser.js';

const router = express.Router();

// Verify token for creating, deleting, and updating clubs
router.post('/create', verifyToken, createClub);
router.delete('/delete/:id', verifyToken, verifyAdmin, deleteClub);
router.post('/update/:id', verifyToken, updateClub);
router.get('/get/:id', getClub);
router.get('/get', getClubs);

export default router;
