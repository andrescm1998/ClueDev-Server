const { Router } = require('express');

const folderController = require('../controllers/folderController');
const folderRouter = Router();

folderRouter.post('/', folderController.getContents);

module.exports = folderRouter;
