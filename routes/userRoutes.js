const { Router } = require('express');

const userController = require('../controllers/userController')

const userRouter = Router();

userRouter.get('/auth', userController.gitAuth);
userRouter.post('/code', userController.PATbyCode);
userRouter.post('/login', userController.login);
userRouter.get('/logout', userController.logout);
userRouter.get('/', userController.getOneById);

module.exports = userRouter;
