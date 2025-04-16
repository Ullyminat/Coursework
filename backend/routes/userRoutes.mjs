import express from 'express';
import UserController from '../controllers/userController.mjs';
import { authToken } from '../middleware/authToken.mjs';
import AdminController from '../controllers/adminController.mjs';

const userrouter = express.Router();

// POST
userrouter.post('/c', AdminController.create);
userrouter.post('/login', UserController.login);
userrouter.post('/logout', authToken, UserController.logout);
// GET
userrouter.get('/me', authToken, UserController.Me);
userrouter.get('/me/cabinets', authToken, UserController.getCabinets);
userrouter.get('/me/schemas', authToken, UserController.getSchema);
userrouter.get('/me/specs', authToken, UserController.getSpec);
userrouter.get('/me/umk', authToken, UserController.getUMK);
userrouter.get('/me/pasports', authToken, UserController.getPasport);
// PUT/PATCH
userrouter.put('/password', authToken, UserController.changeFIO);
userrouter.put('/fio', authToken, UserController.changeFIO);

export default userrouter;