import express from 'express';
import { createTable, deleteTable, updateTable, getTable, getTables } from '../controllers/table.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

// Verify token for creating, deleting, and updating tables
router.post('/create', verifyToken, createTable);
router.delete('/delete/:id', verifyToken, deleteTable);
router.post('/update/:id', verifyToken, updateTable);
router.get('/get/:id', getTable);
router.get('/get', getTables);

export default router;
