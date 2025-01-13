import express from 'express';
import VendorController from '../controller/VendorController';
import authenticateToken from "../middleware";
import { upload } from '../utils/multerConfig';


const router = express.Router();

router.post('/create',authenticateToken,upload.array('attachments', 15), VendorController.createVendor);
router.get('/getVendors',authenticateToken ,VendorController.getVendors);
router.put('/update/:id',authenticateToken, VendorController.updateVendor);
router.delete('/delete/:id',authenticateToken, VendorController.deleteVendor);

export default router;
