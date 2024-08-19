// table.route.js
import express from 'express';
import { createTable, getMatchById,  deleteTable, updateTable, getTable, getTables, getTablesByUser, updateClubsInTable, addClubsToTable, updateMatchResult } from '../controllers/table.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Verify token for creating, deleting, and updating tables
router.post('/create', createTable);
router.post('/add-clubs', addClubsToTable);
router.post('/update-match', verifyToken, updateMatchResult); // New route for updating match result
router.delete('/delete/:id', verifyToken, deleteTable);
router.post('/update/:id', verifyToken, updateTable);
router.get('/get/:id', getTable);
router.get('/get', getTables);
router.get('/user/:userId', getTablesByUser);
router.post('/update-clubs', verifyToken, updateClubsInTable);
router.get('/match/:matchId', getMatchById);



export default router;
