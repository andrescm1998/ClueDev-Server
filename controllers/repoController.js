const Repo = require('../models/Repo');
const GhToken = require('../models/GhToken');
const Token = require('../models/Token');
const User = require('../models/User');
const Collaboration = require('../models/User');
const fetch = require('node-fetch');

const getAllByUsername = async (req, res) => {
    try {
        // Get the user
        const userId = parseInt(req.cookies.userId);
        const user = await User.getOneById(userId)
        console.log(user);
        // Get this users access token
        const ghToken = await GhToken.getOneByUser(userId);
        // console.log(ghToken);

        // Set the options for the fetch request
        const options = {
            headers: {
                'Accept' : 'application/vnd.github+json',
                'Authorization' : `Bearer ${ghToken.ghToken}`
            }
        }

        // Fetch the users repos using the GitHub API
        const response = await fetch(`https://api.github.com/users/${user.ghUsername}/repos`, options);
        const data = await response.json();
        console.log(data);

        // Return the array of repos
        res.status(200).json(data);

    } catch (e) {
        res.status(400).json({ error: e })
    }
}

const getAllByWorkspace = async (req, res) => {
    try {
        // Get the workspace ID and get all repos in this workspace
        const wsId = parseInt(req.query.wsId);
        const repos = await Repo.getAllByWorkspace(wsId);

        // For each repo add an array of collaborators
        repos.forEach( async (repo) => {
            const collaborators = await User.getAllByRepo(repo.id);
            repo.collaborators = collaborators
        })

        res.status(200).json(repos);
    } catch (e) {
        res.status(400).json({ error: e })
    }
}

const getContents = async (req, res) => {
    try {
        // Get the repo details
        const id = parseInt(req.params.id);
        const repo = await Repo.getOneById(id);

        // Get the user
        const userId = parseInt(req.body.userId); // Change to from cookie when setup
        const user = await User.getOneById(userId)

        // Get this users access token
        const ghToken = await GhToken.getOneByUser(userId);

        // Set the options for the fetch request
        const options = {
            headers: {
                'Accept' : 'application/vnd.github+json',
                'Authorization' : `Bearer ${ghToken}`
            }
        }

        // Fetch the users repo to locate the latest commit SHA
        const commitResponse = await fetch(`https://api.github.com/repos/${user.ghUsername}/${repo.name}/branches/main`, options);
        const commitSha = await commitResponse.json().commit.sha;

        // Fetch the repo tree using the commit SHA
        const treeResponse = await fetch(`https://api.github.com/repos/${user.ghUsername}/${repo.name}/git/tree/${commitSha}`, options);
        const treeData = await treeResponse.json();

        // Return the array of repos
        res.status(200).json(treeData);
    } catch (e) {
        res.status(400).json({ error: e });
    }
}

const create = async (req, res) => {
    try {
        // Create the new repo
        const repo = await Repo.create(req.body)
        
        // Get the user through request cookies
        const cookie = req.cookies.ClueDev;
        const token = await Token.getOneByToken(cookie);
        const userId = token.userId;
        const user = await User.getOneById(userId);

        // Get this users access token
        const ghToken = await GhToken.getOneByUser(userId);

        // Set the options for the fetch request
        const options = {
            headers: {
                'Accept' : 'application/vnd.github+json',
                'Authorization' : `Bearer ${ghToken}`
            }
        }

        // Get the repos contributors using user and repo data
        const response = await fetch(`https://api.github.com/repos/${user.ghUsername}/${repo.name}/contributors`, options);
        const contributors = await response.json();

        // Iterate through the contributors adding them as collaborators and users
        contributors.forEach( async (contributor) => {
            const ghUsername = contributor.login;
            const ghAvatar = contributor.avatar_url;
            const wsId = repo.wsId;
            const repoId = repo.id;
            const user = await User.create({ ghUsername, ghAvatar })
            await Collaboration.create({ userId: user.id, wsId, repoId })
        })

        // Get all repos in the workspace
        const repos = await Repo.getAllByWorkspace(repo.wsId)

        // Return all the repos in that workspace
        res.status(200).json(repos)
    } catch (e) {
        res.status(400).json({ error: e })
    }
}

const destroy = async (req, res) => {
    try {
        const repoId = parseInt(req.params.id)
        const repo = await Repo.getOneById(repoId);
        const wsId = repo.wsId;
        repo.destroy();
        const repos = await Repo.getAllByWorkspace(wsId);
        res.status(200).json(repos);
    } catch (e) {
        res.status(400).json({ error: e })
    }
}

module.exports = {
    getAllByUsername, getAllByWorkspace, getContents, create, destroy
}
