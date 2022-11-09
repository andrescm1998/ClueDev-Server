const { Router } = require('express');

const userController = require('../controllers/userController')

const userRouter = Router();

userRouter.post('/login', userController.login);
userRouter.get('/logout', userController.logout);

module.exports = userRouter;
