import express from 'express';
import UserController from '../controllers/user.controller.js';
import jwtAuth from '../middleware/jwt.middleware.js';

const userRouter = express.Router();
let userController = new UserController();

// User management routes
userRouter.get('/', jwtAuth, (req, res, next) => {
    userController.getAllUsers(req, res, next);
});

userRouter.get('/profile', jwtAuth, (req, res, next) => {
    userController.getCurrentUserProfile(req, res, next);
});

userRouter.put('/profile', jwtAuth, (req, res, next) => {
    userController.updateCurrentUserProfile(req, res, next);
});

userRouter.get('/managers', jwtAuth, (req, res, next) => {
    userController.getAllManagers(req, res, next);
});

userRouter.get('/developers', jwtAuth, (req, res, next) => {
    userController.getAllDevelopers(req, res, next);
});

userRouter.get('/:id', jwtAuth, (req, res, next) => {
    userController.getUserById(req, res, next);
});

userRouter.put('/:id', jwtAuth, (req, res, next) => {
    userController.updateUserById(req, res, next);
});

userRouter.delete('/:id', jwtAuth, (req, res, next) => {
    userController.deleteUserById(req, res, next);
});

export default userRouter;
