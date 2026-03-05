const express = require('express');
const router = express.Router();
const { createProgressUpdate, getProgressUpdates, updateProgressUpdate, deleteProgressUpdate } = require('../controllers/ProgressUpdates.controllers');
const { authenticateToken } = require('../middlewares/auth');

router.get('/', getProgressUpdates);
router.post('/', authenticateToken, createProgressUpdate);
router.put('/:id', authenticateToken, updateProgressUpdate);
router.delete('/:id', authenticateToken, deleteProgressUpdate);

module.exports = router;
