const { Router } = require('express');

const repoController = require('../controllers/repoController');
const repoRouter = Router();

repoRouter.post('/', repoController.create);
repoRouter.get(':id', repoController.read);
repoRouter.patch('/:id', repoController.update);
repoRouter.delete('/:id', repoController.destroy);

module.exports = repoRouter;
