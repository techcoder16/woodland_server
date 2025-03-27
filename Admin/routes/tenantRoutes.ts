import express from 'express';
import {

} from '.';
import authenticateToken from "../middleware";
import TenantController from '../controller/TenantController';

const router = express.Router();

router.post('/create',authenticateToken, TenantController.createTenant);
router.get('/tenants',authenticateToken, TenantController.getTenants);

router.post('/update',authenticateToken, TenantController.updateTenant);
router.delete('/delete/:id',authenticateToken, TenantController.deleteTenant);

export default router;
