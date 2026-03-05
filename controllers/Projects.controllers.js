const { Project } = require('../models');

async function createProject(req, res) {
    try {
        let { title, category, description, progress, status } = req.body || {};
        let image = null;

        if (req.file) {
            image = req.file.path;
        }

        if (!title || !description || !category) {
            return res.status(400).json({ success: false, message: 'Please provide title, description, and category' });
        }

        const project = await Project.create({ title, category, description, progress: progress || 0, status: status || 'Ongoing', image });
        return res.status(201).json({ success: true, data: project });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function getProjects(req, res) {
    try {
        const projects = await Project.findAll();
        return res.status(200).json({ success: true, data: projects });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function updateProject(req, res) {
    try {
        const { id } = req.params;
        let { title, category, description, progress, status } = req.body || {};
        let image = undefined;

        if (req.file) {
            image = req.file.path;
        }

        if (!id) {
            return res.status(400).json({ success: false, message: 'Project ID is required' });
        }

        const project = await Project.findByPk(id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        let updateData = { title, category, description, progress, status };
        if (image !== undefined) updateData.image = image;

        await project.update(updateData);
        return res.status(200).json({ success: true, data: project });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

async function deleteProject(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: 'Project ID is required' });
        }

        const project = await Project.findByPk(id);
        if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

        await project.destroy();
        return res.status(200).json({ success: true, message: 'Project deleted successfully' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    createProject,
    getProjects,
    updateProject,
    deleteProject
};
