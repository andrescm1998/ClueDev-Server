// Import User model
require('dotenv').config();
const fetch = require('node-fetch');

const User = require('../models/User');
const GhToken = require('../models/GhToken')

const gitAuth = async (req, res) => {
    console.log('I am here')
    res.json({url: `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=repo`});
};

const PATbyCode = async (req, res) => {
    const code = req.body.code
    // console.log(code);
    const optionsCode = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'},
    }

    const responseCode = await fetch(`https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`, optionsCode);
    const data = await responseCode.json();
    const ghToken = data.access_token;
    // console.log(ghToken);


    const optionsUser = {
        headers: {
            'Accept' : 'application/vnd.github+json',
            'Authorization' : `Bearer ${ghToken}`
        }
    }
    const responseUser = await fetch(`https://api.github.com/user`, optionsUser);
    const username = await responseUser.json();
    console.log(username.login);

    
}

// User Login
const login = async (req, res) => {
    // Fetch the access token from the GitHub API

    // Use the access token to fetch the github username and picture

    // Check if username already exists in the database

    // If not, create a new user

    // Generate a new authorisation token for the app and send in users cookies
}

const logout = async (req, res) => {
    // Logout, clear cookies and delete tokens
}

module.exports = {
    PATbyCode, login, logout, gitAuth
}
