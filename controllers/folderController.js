const Repo = require('../models/Repo');
const User = require('../models/User');
const GhToken = require('../models/GhToken');

const getContents = async (req, res) => {
    try {
        // Get the folder SHA
        const sha = req.query.sha;

        console.log(sha)

        // Get the user
        const userId = parseInt(req.cookies.userId);
        const user = await User.getOneById(userId);

        console.log(user)

        // Get the repo and folder info
        const repoId = parseInt(req.query.repoid);
        const repo = await Repo.getOneById(repoId);

        console.log(repo)

        // Get this users access token
        const ghToken = await GhToken.getOneByUser(userId);

        console.log(ghToken)

        // Set the options for the fetch request
        const options = {
            headers: {
                'Accept' : 'application/vnd.github+json',
                'Authorization' : `Bearer ${ghToken.ghToken}`
            }
        }

        // Fetch the repo tree using the commit SHA
        const response = await fetch(`https://api.github.com/repos/${user.ghUsername}/${repo.name}/git/trees/${sha}`, options);
        const data = await response.json();

        console.log(data)

    res.status(200).json(data);
    } catch (e) {
        res.status(400).json({ error: e })
    }
}

module.exports = {
    getContents
}
