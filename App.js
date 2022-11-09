const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send('Welcome to the ClueDev API!')
})

app.get('/auth', (req, res) => {
    res.json({url: `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}`})
})

app.post('/code', async (req, res) => {
    const code = req.body
    
    const options = {
        method: POST,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json'},
    }

    const response = await fetch(`https://github.com/login/oauth/access_token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}`, options);
    const data = await response.json();
    console.log(data)
})

module.exports = app;
