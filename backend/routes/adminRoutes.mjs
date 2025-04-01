import express from 'express';
import AdminController from '../controllers/adminController.mjs';
import { authToken } from '../middleware/authToken.mjs';

const adminrouter = express.Router();

adminrouter.post('/user', authToken, AdminController.create);
adminrouter.put('/user/chrole/:id', authToken, AdminController.changeRole);
adminrouter.put('/user/addcabinet/:id', authToken, AdminController.updateUserCabinets);
adminrouter.get('/user', authToken, AdminController.getUsers);
adminrouter.get('/user/:id', authToken, AdminController.getUser);
adminrouter.delete('/user/:id', authToken,AdminController.deleteUser);
adminrouter.get('/cabinets', authToken, AdminController.getCabinets);
adminrouter.post('/cabinet', authToken, AdminController.createCabinet);
adminrouter.post('/spec', authToken, AdminController.createSpec);
adminrouter.post('/umk', authToken, AdminController.createUMK);

export default adminrouter;