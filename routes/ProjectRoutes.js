const express = require('express');
const router = express.Router();
const { createProject, getProjects, updateProject, deleteProject } = require('../controllers/Projects.controllers');
const { authenticateToken } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.get('/', getProjects);

router.post('/', authenticateToken, upload.single('image'), createProject);
router.put('/:id', authenticateToken, upload.single('image'), updateProject);
router.delete('/:id', authenticateToken, deleteProject);

module.exports = router;
