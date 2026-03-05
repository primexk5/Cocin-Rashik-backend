// announcements controllers for handling announcements with single admin login create announcement update announcement delete announcement and get announcements

const { Announcement } = require('../models');
const jwt = require('jsonwebtoken');

// Create a new announcement
async function adminLogin(req, res) {
  try {
    const { username, password } = req.body || {};
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    if (username === adminUsername && password === adminPassword) {
      const token = jwt.sign(
        { username: adminUsername, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '30m' }
      );
      return res.status(200).json({ success: true, message: 'Admin logged in successfully', token });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function createAnnouncement(req, res) {
  try {
    let { title, content } = req.body || {};
    let image = null;

    if (req.file) {
      image = req.file.path;
    }

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Please provide title and content' });
    }

    const announcement = await Announcement.create({ title, content, image });
    return res.status(201).json({ success: true, data: announcement });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getAnnouncements(req, res) {
  try {
    const announcements = await Announcement.findAll();
    return res.status(200).json({ success: true, data: announcements });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function updateAnnouncement(req, res) {
  try {
    const { id } = req.params;
    let { title, content } = req.body || {};
    let image = undefined;

    if (req.file) {
      image = req.file.path;
    }

    if (!id) {
      return res.status(400).json({ success: false, message: 'Announcement ID is required' });
    }

    if ((title !== undefined && !title) || (content !== undefined && !content)) {
      return res.status(400).json({ success: false, message: 'Fields cannot be empty' });
    }

    const announcement = await Announcement.findByPk(id);
    if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found' });

    let updateData = { title, content };
    if (image !== undefined) updateData.image = image;

    await announcement.update(updateData);
    return res.status(200).json({ success: true, data: announcement });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function deleteAnnouncement(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Announcement ID is required' });
    }

    const announcement = await Announcement.findByPk(id);
    if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found' });

    await announcement.destroy();
    return res.status(200).json({ success: true, message: 'Announcement deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
  adminLogin,
};
