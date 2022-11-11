const { Router } = require('express');

const testController = require('../controllers/testController')
const testRouter = Router();

testRouter.post('/create', testController.create);
testRouter.get('/:id', testController.read);
testRouter.patch('/:id', testController.update);
testRouter.delete('/:id', testController.destroy);

module.exports = testRouter;
