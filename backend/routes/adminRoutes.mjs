import express from 'express';
import AdminController from '../controllers/adminController.mjs';
import { authToken } from '../middleware/authToken.mjs';

const adminrouter = express.Router();

// POST
adminrouter.post('/user', authToken, AdminController.create);
adminrouter.post('/cabinet', authToken, AdminController.createCabinet);
adminrouter.post('/spec', authToken, AdminController.createSpec);
adminrouter.post('/umk', authToken, AdminController.createUMK);
// PUT/PATCH
adminrouter.put('/user/chrole/:id', authToken, AdminController.changeRole);
adminrouter.put('/user/addcabinet/:id', authToken, AdminController.updateUserCabinets);
// GET
adminrouter.get('/user', authToken, AdminController.getUsers);
adminrouter.get('/cabinet', authToken, AdminController.getCabinets);
adminrouter.get('/spec', authToken, AdminController.getSpecs);
adminrouter.get('/umk', authToken, AdminController.getUMKs);
adminrouter.get('/user/:id', authToken, AdminController.getUser);
adminrouter.get('/cabinets', authToken, AdminController.getCabinets);
// DELETE
adminrouter.delete('/user/:id', authToken,AdminController.deleteUser);
adminrouter.delete('/cabinet/:id', authToken,AdminController.deleteCabinet);
adminrouter.delete('/spec/:id', authToken,AdminController.deleteSpec);
adminrouter.delete('/umk/:id', authToken,AdminController.deleteUMK);

export default adminrouter;