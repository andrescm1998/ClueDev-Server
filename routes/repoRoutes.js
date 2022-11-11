const { Router } = require('express');

const repoController = require('../controllers/repoController');
const repoRouter = Router();

repoRouter.post('/', repoController.create);
repoRouter.get('/user', repoController.getAllByUsername);
repoRouter.get('/workspace', repoController.getAllByWorkspace);
repoRouter.get(':id', repoController.getContents);
// repoRouter.patch('/:id', repoController.update);
repoRouter.delete('/:id', repoController.destroy);

module.exports = repoRouter;
