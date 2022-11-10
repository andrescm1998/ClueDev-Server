// Import User model
const User = require('../models/User');

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
