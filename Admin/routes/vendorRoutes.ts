import express from 'express';
import VendorController from '../controller/VendorController';
import authenticateToken from "../middleware";
import { upload } from '../utils/multerConfig';


const router = express.Router();

router.post('/create',authenticateToken,upload.array('attachments', 15), VendorController.createVendor);
router.get('/getVendors',authenticateToken ,VendorController.getVendors);
router.post('/update',authenticateToken,upload.array('attachments', 15), VendorController.updateVendor);
router.delete('/delete/:id',authenticateToken, VendorController.deleteVendor);
router.get("/getVendorById/:id",authenticateToken, VendorController.getVendorById);

export default router;
