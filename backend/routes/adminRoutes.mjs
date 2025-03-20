import express from 'express';
import AdminController from '../controllers/adminController.mjs';
import { authToken } from '../middleware/authToken.mjs';

const adminrouter = express.Router();

adminrouter.post('/user', authToken, AdminController.create);
adminrouter.put('/user/chrole/:id', authToken, AdminController.changeRole);
adminrouter.get('/user', authToken, AdminController.getUsers);
adminrouter.delete('/user', authToken,AdminController.deleteUser);

export default adminrouter;