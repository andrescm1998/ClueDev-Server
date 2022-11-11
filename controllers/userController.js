// Import User model
require('dotenv').config();
const fetch = require('node-fetch');

const User = require('../models/User');
const GhToken = require('../models/GhToken')
const Token = require('../models/Token');

const gitAuth = async (req, res) => {
    // console.log('I am here')
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

    const userData = await responseUser.json();

    const checkUser = await User.getOneByUsername(userData.login)

    if(!checkUser.ghUsername){

        const user = {ghUsername: userData.login, ghAvatar: userData.avatar_url}

        const newUser = await User.create(user);
        
        await GhToken.create({ghToken: ghToken, userId: newUser.id})
        const cookieAge = 1000*60*60*24*7;
        const token = await Token.create(newUser.id);
        res.cookie("ClueDev", token.token, { maxAge: cookieAge, sameSite: 'None', secure: true })
        
        res.status(200).json(newUser)

    }
    else{

        await GhToken.create({ghToken: ghToken, userId: checkUser.id})
        const cookieAge = 1000*60*60*24*7;
        const token = await Token.create(checkUser.id);
        res.cookie("ClueDev", token.token, { maxAge: cookieAge, sameSite: 'None', secure: true })
        
        res.status(200).json(checkUser)
    }
    
    

    
}

const checkCookie = async (req, res) => {
    
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
    const token = await Token.getOneByToken(req.cookies.ClueDev)
    const user = await User.getOneById(token.userId)
    const ghToken = await GhToken.getOneByUser(user.id)
    token.destroy();
    ghToken.destroy()

    res.clearCookie("ClueDev", {
        sameSite: "none",
        secure: true,
      });
    res.status(200).end();
}

module.exports = {
    PATbyCode, login, logout, gitAuth
}
