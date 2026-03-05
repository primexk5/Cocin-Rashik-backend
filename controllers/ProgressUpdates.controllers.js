const { ProgressUpdate } = require('../models');

async function createProgressUpdate(req, res) {
    try {
        const { title, content } = req.body || {};
        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title and content are required' });
        }
        const update = await ProgressUpdate.create({ title, content });
        return res.status(201).json({ success: true, data: update });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function getProgressUpdates(req, res) {
    try {
        const updates = await ProgressUpdate.findAll({ order: [['createdAt', 'DESC']] });
        return res.status(200).json({ success: true, data: updates });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function updateProgressUpdate(req, res) {
    try {
        const { id } = req.params;
        const { title, content } = req.body || {};
        if (!id) return res.status(400).json({ success: false, message: 'ID required' });

        const update = await ProgressUpdate.findByPk(id);
        if (!update) return res.status(404).json({ success: false, message: 'Progress update not found' });

        await update.update({ title, content });
        return res.status(200).json({ success: true, data: update });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function deleteProgressUpdate(req, res) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: 'ID required' });

        const update = await ProgressUpdate.findByPk(id);
        if (!update) return res.status(404).json({ success: false, message: 'Progress update not found' });

        await update.destroy();
        return res.status(200).json({ success: true, message: 'Progress update deleted' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    createProgressUpdate,
    getProgressUpdates,
    updateProgressUpdate,
    deleteProgressUpdate
};
