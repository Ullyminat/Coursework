import express from 'express';
import docController from '../controllers/docController.mjs';
import { authToken } from '../middleware/authToken.mjs';
import { upload } from '../config/uploader.mjs';

const docxrouter = express.Router();

// POST
docxrouter.post('/gendocx', authToken, upload.single('file'),docController.generateDoc);
docxrouter.post('/save', authToken, upload.single("image"),docController.saveSchema);
// GET
docxrouter.get('/:pasportId/download', authToken, docController.downloadPasport);
// DELETE
docxrouter.delete('/:pasportId', authToken, docController.deletePasport);

export default docxrouter;