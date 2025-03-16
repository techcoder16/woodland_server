import express from 'express';
import PropertyController from '../controller/PropertyController';
import authenticateToken from "../middleware";
import { upload } from '../utils/multerConfig';

const router = express.Router();

router.post('/create', authenticateToken, upload.array('attachments', 15), PropertyController.createProperty);
router.get('/getProperties', authenticateToken, PropertyController.getProperties);
router.post('/update', authenticateToken, upload.array('attachments', 15), PropertyController.updateProperty);
router.delete('/delete/:id', authenticateToken, PropertyController.deleteProperty);

export default router;
