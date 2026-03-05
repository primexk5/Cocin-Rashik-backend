const express = require('express');
const router = express.Router();
const { createSermon, getSermons, updateSermon, deleteSermon } = require('../controllers/Sermons.controllers');
const upload = require('../middlewares/upload');

router.get('/', getSermons);
router.post('/', upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]), createSermon);
router.put('/:id', upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]), updateSermon);
router.delete('/:id', deleteSermon);

module.exports = router;
