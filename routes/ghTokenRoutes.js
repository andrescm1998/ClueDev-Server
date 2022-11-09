const { Router } = require('express');

const counterController = require('../controllers/repoController');
const counterRouter = Router();

counterRouter.post('/', counterController.create);
counterRouter.get(':id', counterController.read);
counterRouter.delete('/:id', counterController.destroy);

module.exports = counterRouter;
