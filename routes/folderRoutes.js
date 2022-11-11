const { Router } = require('express');

const folderController = require('../controllers/folderController');
const folderRouter = Router();

folderRouter.get('/', folderController.getContents);

module.exports = folderRouter;
