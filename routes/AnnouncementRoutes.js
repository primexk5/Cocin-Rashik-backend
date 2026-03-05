const express = require('express');
const router = express.Router();
const { createAnnouncement, getAnnouncements, updateAnnouncement, deleteAnnouncement, adminLogin } = require('../controllers/Announcements.controllers');
const { authenticateToken } = require('../middlewares/auth');
const upload = require('../middlewares/upload');


router.post('/admin/login', adminLogin);


router.get('/', getAnnouncements);


router.post('/', authenticateToken, upload.single('image'), createAnnouncement);
router.put('/:id', authenticateToken, upload.single('image'), updateAnnouncement);
router.delete('/:id', authenticateToken, deleteAnnouncement);

module.exports = router;
