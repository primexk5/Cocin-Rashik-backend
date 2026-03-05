const { Update } = require('../models');
const { toStr, parseId } = require('../utils/sanitize');

async function createUpdate(req, res) {
    try {
        const title = toStr(req.body?.title, 300);
        const content = toStr(req.body?.content, 5000);

        if (!title || !content) {
            return res.status(400).json({ success: false, message: 'Title and content are required' });
        }

        const update = await Update.create({ title, content });
        return res.status(201).json({ success: true, data: update });
    } catch (err) {
        console.error('[createUpdate]', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function getUpdates(req, res) {
    try {
        const updates = await Update.findAll({ order: [['createdAt', 'DESC']] });
        return res.status(200).json({ success: true, data: updates });
    } catch (err) {
        console.error('[getUpdates]', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function updateUpdate(req, res) {
    try {
        const id = parseId(req.params.id);
        if (!id) return res.status(400).json({ success: false, message: 'A valid numeric ID is required' });

        const title = toStr(req.body?.title, 300);
        const content = toStr(req.body?.content, 5000);

        const update = await Update.findByPk(id);
        if (!update) return res.status(404).json({ success: false, message: 'Update not found' });

        await update.update({ title, content });
        return res.status(200).json({ success: true, data: update });
    } catch (err) {
        console.error('[updateUpdate]', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function deleteUpdate(req, res) {
    try {
        const id = parseId(req.params.id);
        if (!id) return res.status(400).json({ success: false, message: 'A valid numeric ID is required' });

        const update = await Update.findByPk(id);
        if (!update) return res.status(404).json({ success: false, message: 'Update not found' });

        await update.destroy();
        return res.status(200).json({ success: true, message: 'Update deleted' });
    } catch (err) {
        console.error('[deleteUpdate]', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = { createUpdate, getUpdates, updateUpdate, deleteUpdate };
