const express = require('express');
const router = express.Router();
const { createUpdate, getUpdates, updateUpdate, deleteUpdate } = require('../controllers/Updates.controllers');
const { authenticateToken } = require('../middlewares/auth');

router.get('/', getUpdates);
router.post('/', authenticateToken, createUpdate);
router.put('/:id', authenticateToken, updateUpdate);
router.delete('/:id', authenticateToken, deleteUpdate);

module.exports = router;
