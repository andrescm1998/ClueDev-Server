const { Router } = require('express');

const wsController = require('../controllers/wsController')
const wsRouter = Router();

wsRouter.post('/', wsController.create);
wsRouter.get('/user', wsController.getAllByUsername);
wsRouter.get('/:id', wsController.read);
wsRouter.patch('/:id', wsController.update);
wsRouter.delete('/:id', wsController.destroy);

module.exports = wsRouter;
