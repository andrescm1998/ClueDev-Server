const Repo = require('../models/Repo');
const User = require('../models/User');
const GhToken = require('../models/GhToken');
const fetch = require('node-fetch');

const getContents = async (req, res) => {
    try {
        // Get the folder SHA
        const url = req.body.url
        // const sha = req.query.sha;
        // console.log(req.query)
        // console.log(sha);
        // 

        // // Get the repo and folder info
        // const repoId = parseInt(req.query.repoid);
        // const repo = await Repo.getOneById(repoId);
        
        // console.log(repo)
        // // console.log(typeof req.cookies.ClueDev);
        // // Get this users access token
        // const ghToken = await GhToken.getOneByUser(userId);
        // // console.log('Hi');
        // // console.log(ghToken.ghToken)

        const userId = parseInt(req.cookies.userId)
        const ghToken = await GhToken.getOneByUser(userId);

        // Set the options for the fetch request
        const options = {
            headers: {
                'Accept' : 'application/vnd.github+json',
                'Authorization' : `Bearer ${ghToken.ghToken}`
            }
        }

        // console.log(url);

        // Fetch the repo tree using the commit SHA
        const response = await fetch(url, options);
        // console.log('I am here')
        // console.log(response);
        const data = await response.json();

        // console.log(data)

    res.status(200).json(data);
    } catch (e) {
        res.status(400).json({ error: e })
    }
}

module.exports = {
    getContents
}
