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

module.exports = app;
