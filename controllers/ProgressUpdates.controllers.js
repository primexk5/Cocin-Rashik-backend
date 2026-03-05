const { ProgressUpdate } = require('../models');
const { toStr, parseId } = require('../utils/sanitize');

async function createProgressUpdate(req, res) {
    try {
        const title = toStr(req.body?.title, 300);
        const content = toStr(req.body?.content, 5000);

        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title and content are required' });
        }

        const update = await ProgressUpdate.create({ title, content });
        return res.status(201).json({ success: true, data: update });
    } catch (err) {
        console.error('[createProgressUpdate]', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function getProgressUpdates(req, res) {
    try {
        const updates = await ProgressUpdate.findAll({ order: [['createdAt', 'DESC']] });
        return res.status(200).json({ success: true, data: updates });
    } catch (err) {
        console.error('[getProgressUpdates]', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function updateProgressUpdate(req, res) {
    try {
        const id = parseId(req.params.id);
        if (!id) return res.status(400).json({ success: false, message: 'A valid numeric ID is required' });

        const title = toStr(req.body?.title, 300);
        const content = toStr(req.body?.content, 5000);

        const update = await ProgressUpdate.findByPk(id);
        if (!update) return res.status(404).json({ success: false, message: 'Progress update not found' });

        await update.update({ title, content });
        return res.status(200).json({ success: true, data: update });
    } catch (err) {
        console.error('[updateProgressUpdate]', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function deleteProgressUpdate(req, res) {
    try {
        const id = parseId(req.params.id);
        if (!id) return res.status(400).json({ success: false, message: 'A valid numeric ID is required' });

        const update = await ProgressUpdate.findByPk(id);
        if (!update) return res.status(404).json({ success: false, message: 'Progress update not found' });

        await update.destroy();
        return res.status(200).json({ success: true, message: 'Progress update deleted' });
    } catch (err) {
        console.error('[deleteProgressUpdate]', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = { createProgressUpdate, getProgressUpdates, updateProgressUpdate, deleteProgressUpdate };
