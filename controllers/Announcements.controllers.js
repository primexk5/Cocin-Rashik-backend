const { Announcement } = require('../models');
const jwt = require('jsonwebtoken');
const { toStr, parseId } = require('../utils/sanitize');

async function adminLogin(req, res) {
  try {
    const username = toStr(req.body?.username, 100);
    const password = toStr(req.body?.password, 200);

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { username: process.env.ADMIN_USERNAME, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '30m' }
      );
      return res.status(200).json({ success: true, message: 'Admin logged in successfully', token });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (err) {
    console.error('[adminLogin]', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function createAnnouncement(req, res) {
  try {
    const title = toStr(req.body?.title, 300);
    const content = toStr(req.body?.content, 5000);
    const image = req.file ? req.file.path : null;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Please provide title and content' });
    }

    const announcement = await Announcement.create({ title, content, image });
    return res.status(201).json({ success: true, data: announcement });
  } catch (err) {
    console.error('[createAnnouncement]', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function getAnnouncements(req, res) {
  try {
    const announcements = await Announcement.findAll();
    return res.status(200).json({ success: true, data: announcements });
  } catch (err) {
    console.error('[getAnnouncements]', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function updateAnnouncement(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'A valid numeric Announcement ID is required' });
    }

    const title = toStr(req.body?.title, 300);
    const content = toStr(req.body?.content, 5000);
    const image = req.file ? req.file.path : undefined;

    // Allow partial updates, but reject explicitly-provided empty strings
    if (req.body?.title !== undefined && !title) {
      return res.status(400).json({ success: false, message: 'Title cannot be empty' });
    }
    if (req.body?.content !== undefined && !content) {
      return res.status(400).json({ success: false, message: 'Content cannot be empty' });
    }

    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    const updateData = { title, content };
    if (image !== undefined) updateData.image = image;

    await announcement.update(updateData);
    return res.status(200).json({ success: true, data: announcement });
  } catch (err) {
    console.error('[updateAnnouncement]', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function deleteAnnouncement(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'A valid numeric Announcement ID is required' });
    }

    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: 'Announcement not found' });
    }

    await announcement.destroy();
    return res.status(200).json({ success: true, message: 'Announcement deleted successfully' });
  } catch (err) {
    console.error('[deleteAnnouncement]', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  adminLogin,
};
