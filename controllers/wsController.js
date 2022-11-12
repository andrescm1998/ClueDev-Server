const Workspace = require('../models/Workspace');
const User = require('../models/User');
const Collaboration = require('../models/Collaboration');

// Create workspace
const create = async (req, res) => {
    try {
        // Create a new workspace
        const workspace = await Workspace.create(req.body);

        // Get the creator of the workspace
        const user = await User.getOneById(req.body.userId);

        // Add that user as the initial collaborator
        await Collaboration.create({ ghUsername: user.ghUsername, wsId: workspace.id })

        // Filter workspaces by this users collaborations
        const workspaces = await Workspace.getAllByUsername(user.ghUsername)

        // Return the workspaces
        res.status(200).json(workspaces)
    } catch (e) {
        res.status(400).json({ error: e })
    }
}

// Get workspaces by user
const getAllByUsername = async (req, res) => {
    try {
        // Get the user ID to filter the workspaces
        const userId = parseInt(req.cookies.userId);

        // Get the GitHub username using the user ID
        const user = await User.getOneById(userId)

        // Filter the workspaces based on this users collaborations
        const workspaces = await Workspace.getAllByUsername(user.ghUsername)

        // For each workspace add an array of collaborators
        workspaces.forEach( async (workspace) => {
            const collaborators = await User.getAllByWorkspace(workspace.id);
            workspace.collaborators = collaborators;
        })

        // Return the workspaces
        res.status(200).json(workspaces)
    } catch (e) {
        res.status(400).json({ error: e })
    }
}

// Update workspace
const update = async (req, res) => {
    try {
        // Get the ID of the workspace and the new content in the body
        const id = parseInt(req.params.id)
        const wsName = req.body.wsName;

        // Select the workspace by ID and update with the new data
        const workspace = await Workspace.getOneById(id)
        await workspace.update(wsName)

        // Get the user by ID and return all workspaces filtered by this users collaborations
        const user = await User.getOneById(workspace.userId)
        const workspaces = await Workspace.getAllByUsername(user.ghUsername)

        // Return the workspaces
        res.status(200).json(workspaces)
    } catch (e) {
        res.status(400).json({ error: e })
    }
}

// Delete the workspace
const destroy = async (req, res) => {
    try {
        // Get the ID of the workspace to delete
        const id = parseInt(req.params.id)

        // Get the workspace and creator by ID and delete the workspace
        const workspace = await Workspace.getOneById(id)
        const user = await User.getOneById(workspace.userId)
        await workspace.delete()

        // Get all workspaces filtered by this users collaborations
        const workspaces = await Workspace.getAllByUsername(user.ghUsername)

        // Return the workspaces
        res.status(200).json(workspaces)
    } catch (e) {
        res.status(400).json({ error: e })
    }
}


module.exports = {
    create, getAllByUsername, update, destroy
}
