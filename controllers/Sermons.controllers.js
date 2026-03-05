const { Sermon } = require('../models');


async function createSermon(req, res) {
  try {
    let { title, preacher, audioUrl, thumbnailUrl } = req.body || {};

    if (req.files) {
      if (req.files.audio && req.files.audio[0]) {
        audioUrl = req.files.audio[0].path;
      }
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        thumbnailUrl = req.files.thumbnail[0].path;
      }
    }

    if (!title || !preacher || !audioUrl) {
      return res.status(400).json({ success: false, message: 'Please provide title, preacher, and audioUrl' });
    }

    const sermon = await Sermon.create({ title, preacher, audioUrl, thumbnailUrl });
    return res.status(201).json({ success: true, data: sermon });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get all sermons
async function getSermons(req, res) {
  try {
    const sermons = await Sermon.findAll();
    return res.status(200).json({ success: true, data: sermons });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Update a sermon
async function updateSermon(req, res) {
  try {
    const { id } = req.params;
    let { title, preacher, audioUrl, thumbnailUrl } = req.body || {};

    if (req.files) {
      if (req.files.audio && req.files.audio[0]) {
        audioUrl = req.files.audio[0].path;
      }
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        thumbnailUrl = req.files.thumbnail[0].path;
      }
    }

    if (!id) {
      return res.status(400).json({ success: false, message: 'Sermon ID is required' });
    }

    if ((title !== undefined && !title) || (preacher !== undefined && !preacher) || (audioUrl !== undefined && !audioUrl)) {
      return res.status(400).json({ success: false, message: 'Fields cannot be empty' });
    }

    const sermon = await Sermon.findByPk(id);
    if (!sermon) return res.status(404).json({ success: false, message: 'Sermon not found' });

    await sermon.update({ title, preacher, audioUrl, thumbnailUrl });
    return res.status(200).json({ success: true, data: sermon });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Delete a sermon
async function deleteSermon(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Sermon ID is required' });
    }

    const sermon = await Sermon.findByPk(id);
    if (!sermon) return res.status(404).json({ success: false, message: 'Sermon not found' });

    await sermon.destroy();
    return res.status(200).json({ success: true, message: 'Sermon deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createSermon,
  getSermons,
  updateSermon,
  deleteSermon
};  