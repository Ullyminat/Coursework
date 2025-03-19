import express from 'express';
import UserController from '../controllers/userController.mjs';
import { authToken } from '../middleware/authToken.mjs';

const userrouter = express.Router();

userrouter.post('/create', UserController.create);
userrouter.post('/login', UserController.login);
userrouter.post('/logout', authToken, UserController.logout);
userrouter.get('/me', authToken, UserController.Me);
userrouter.get('/me/cabinets', authToken, UserController.getCabinets);
userrouter.get('/me/schemas', authToken, UserController.getSchema);
userrouter.get('/me/specs', authToken, UserController.getSpec);
userrouter.get('/me/umk', authToken, UserController.getUMK);
userrouter.get('/me/pasports', authToken, UserController.getPasport);

export default userrouter;