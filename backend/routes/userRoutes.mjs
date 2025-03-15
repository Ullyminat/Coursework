import express from 'express';
import UserController from '../controllers/userController.mjs';
import { authToken } from '../middleware/authToken.mjs';

const userrouter = express.Router();

userrouter.post('/create', UserController.create);
userrouter.post('/login', UserController.login);
userrouter.get('/me/cabinets', authToken, UserController.getCabinets);

export default userrouter;