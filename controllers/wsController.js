const Workspace = require('../models/Workspace');
const User = require('../models/User');
const Collaboration = require('../models/Collaboration');

// Create workspace
const create = async (req, res) => {

    try {
        const userId = parseInt(req.body.userId);
        const wsName = req.body.wsName;
        const data = { userId, wsName };
        const workspace = await Workspace.create(data);
        const user = await User.getOneById(userId);
        await Collaboration.create({ ghUsername: user.ghUsername, wsId: workspace.id })
        const workspaces = await Workspace.getAllByUsername(user.ghUsername)
        res.status(201).json(workspaces)
    } catch (e) {
        res.status(400).json({ error: e })
    }
}

// Get workspaces by user
const getAllByUsername = async (req, res) => {

    try {
        const userId = parseInt(req.body.userId);
        const user = await User.getOneById(userId)
        const workspaces = await Workspace.getAllByUsername(user.ghUsername)
        res.status(200).json(workspaces)
    } catch (e) {
        res.status(400).json({ error: e })
    }
}

// Update workspace
const update = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const data = req.body;
        const workspace = await Workspace.getOneById(id)
        await workspace.update(data)

    } catch (e) {
        
    }
}

module.exports = {
    create, getAllByUsername, update
}
