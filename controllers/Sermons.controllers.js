const { Sermon } = require('../models');
const { toStr, parseId } = require('../utils/sanitize');

async function createSermon(req, res) {
  try {
    let title = toStr(req.body?.title, 300);
    let preacher = toStr(req.body?.preacher, 200);
    let audioUrl = toStr(req.body?.audioUrl, 500);
    let thumbnailUrl = toStr(req.body?.thumbnailUrl, 500);

    if (req.files) {
      if (req.files.audio?.[0]) audioUrl = req.files.audio[0].path;
      if (req.files.thumbnail?.[0]) thumbnailUrl = req.files.thumbnail[0].path;
    }

    if (!title || !preacher || !audioUrl) {
      return res.status(400).json({ success: false, message: 'Please provide title, preacher, and audioUrl' });
    }

    const sermon = await Sermon.create({ title, preacher, audioUrl, thumbnailUrl });
    return res.status(201).json({ success: true, data: sermon });
  } catch (err) {
    console.error('[createSermon]', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function getSermons(req, res) {
  try {
    const sermons = await Sermon.findAll();
    return res.status(200).json({ success: true, data: sermons });
  } catch (err) {
    console.error('[getSermons]', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function updateSermon(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'A valid numeric Sermon ID is required' });
    }

    let title = toStr(req.body?.title, 300);
    let preacher = toStr(req.body?.preacher, 200);
    let audioUrl = toStr(req.body?.audioUrl, 500);
    let thumbnailUrl = toStr(req.body?.thumbnailUrl, 500);

    if (req.files) {
      if (req.files.audio?.[0]) audioUrl = req.files.audio[0].path;
      if (req.files.thumbnail?.[0]) thumbnailUrl = req.files.thumbnail[0].path;
    }

    if (
      (req.body?.title !== undefined && !title) ||
      (req.body?.preacher !== undefined && !preacher) ||
      (req.body?.audioUrl !== undefined && !audioUrl && !req.files?.audio?.[0])
    ) {
      return res.status(400).json({ success: false, message: 'Fields cannot be empty' });
    }

    const sermon = await Sermon.findByPk(id);
    if (!sermon) return res.status(404).json({ success: false, message: 'Sermon not found' });

    await sermon.update({ title, preacher, audioUrl, thumbnailUrl });
    return res.status(200).json({ success: true, data: sermon });
  } catch (err) {
    console.error('[updateSermon]', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

async function deleteSermon(req, res) {
  try {
    const id = parseId(req.params.id);
    if (!id) {
      return res.status(400).json({ success: false, message: 'A valid numeric Sermon ID is required' });
    }

    const sermon = await Sermon.findByPk(id);
    if (!sermon) return res.status(404).json({ success: false, message: 'Sermon not found' });

    await sermon.destroy();
    return res.status(200).json({ success: true, message: 'Sermon deleted successfully' });
  } catch (err) {
    console.error('[deleteSermon]', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

module.exports = { createSermon, getSermons, updateSermon, deleteSermon };