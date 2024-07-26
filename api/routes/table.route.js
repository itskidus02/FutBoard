// table.route.js
import express from 'express';
import { createTable, deleteTable, updateTable, getTable, getTables, getTablesByUser, addClubsToTable, updateMatchResult } from '../controllers/table.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Verify token for creating, deleting, and updating tables
router.post('/create', createTable);
router.post('/add-clubs', addClubsToTable);
router.post('/update-match', updateMatchResult); // New route for updating match result
router.delete('/delete/:id', verifyToken, deleteTable);
router.post('/update/:id', verifyToken, updateTable);
router.get('/get/:id', getTable);
router.get('/get', getTables);
router.get('/user/:userId', verifyToken, getTablesByUser);

export default router;
