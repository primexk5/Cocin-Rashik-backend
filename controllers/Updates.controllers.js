const { Update } = require('../models');

async function createUpdate(req, res) {
    try {
        const { title, content } = req.body || {};
        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title and content are required' });
        }
        const update = await Update.create({ title, content });
        return res.status(201).json({ success: true, data: update });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function getUpdates(req, res) {
    try {
        const updates = await Update.findAll({ order: [['createdAt', 'DESC']] });
        return res.status(200).json({ success: true, data: updates });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function updateUpdate(req, res) {
    try {
        const { id } = req.params;
        const { title, content } = req.body || {};
        if (!id) return res.status(400).json({ success: false, message: 'ID required' });

        const update = await Update.findByPk(id);
        if (!update) return res.status(404).json({ success: false, message: 'Update not found' });

        await update.update({ title, content });
        return res.status(200).json({ success: true, data: update });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function deleteUpdate(req, res) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ success: false, message: 'ID required' });

        const update = await Update.findByPk(id);
        if (!update) return res.status(404).json({ success: false, message: 'Update not found' });

        await update.destroy();
        return res.status(200).json({ success: true, message: 'Update deleted' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    createUpdate,
    getUpdates,
    updateUpdate,
    deleteUpdate
};
