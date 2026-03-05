const { Project } = require('../models');
const { toStr, toInt, parseId } = require('../utils/sanitize');

const VALID_STATUSES = ['Ongoing', 'Completed', 'Paused'];

async function createProject(req, res) {
    try {
        const title = toStr(req.body?.title, 300);
        const category = toStr(req.body?.category, 200);
        const description = toStr(req.body?.description, 5000);
        const image = req.file ? req.file.path : null;

        // progress must be an integer 0-100
        const rawProgress = req.body?.progress;
        const progress = rawProgress !== undefined
            ? toInt(rawProgress, 0, 100)
            : 0;

        if (progress === undefined) {
            return res.status(400).json({ success: false, message: 'progress must be an integer between 0 and 100' });
        }

        // status must be one of the allowed values
        const rawStatus = toStr(req.body?.status, 50);
        const status = rawStatus && VALID_STATUSES.includes(rawStatus) ? rawStatus : 'Ongoing';

        if (!title || !description || !category) {
            return res.status(400).json({ success: false, message: 'Please provide title, description, and category' });
        }

        const project = await Project.create({ title, category, description, progress, status, image });
        return res.status(201).json({ success: true, data: project });
    } catch (err) {
        console.error('[createProject]', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function getProjects(req, res) {
    try {
        const projects = await Project.findAll();
        return res.status(200).json({ success: true, data: projects });
    } catch (err) {
        console.error('[getProjects]', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function updateProject(req, res) {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: 'A valid numeric Project ID is required' });
        }

        const title = toStr(req.body?.title, 300);
        const category = toStr(req.body?.category, 200);
        const description = toStr(req.body?.description, 5000);
        const image = req.file ? req.file.path : undefined;

        // Validate progress only when explicitly provided
        let progress;
        if (req.body?.progress !== undefined) {
            progress = toInt(req.body.progress, 0, 100);
            if (progress === undefined) {
                return res.status(400).json({ success: false, message: 'progress must be an integer between 0 and 100' });
            }
        }

        // Validate status only when explicitly provided
        let status;
        if (req.body?.status !== undefined) {
            const rawStatus = toStr(req.body.status, 50);
            if (!rawStatus || !VALID_STATUSES.includes(rawStatus)) {
                return res.status(400).json({ success: false, message: `status must be one of: ${VALID_STATUSES.join(', ')}` });
            }
            status = rawStatus;
        }

        const project = await Project.findByPk(id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        const updateData = { title, category, description, progress, status };
        if (image !== undefined) updateData.image = image;

        await project.update(updateData);
        return res.status(200).json({ success: true, data: project });
    } catch (err) {
        console.error('[updateProject]', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

async function deleteProject(req, res) {
    try {
        const id = parseId(req.params.id);
        if (!id) {
            return res.status(400).json({ success: false, message: 'A valid numeric Project ID is required' });
        }

        const project = await Project.findByPk(id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        await project.destroy();
        return res.status(200).json({ success: true, message: 'Project deleted successfully' });
    } catch (err) {
        console.error('[deleteProject]', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

module.exports = { createProject, getProjects, updateProject, deleteProject };
