import express from 'express';
import {

} from '.';
import authenticateToken from "../middleware";
import TenantController from '../controller/TenantController';

const router = express.Router();

router.post('/tenants',authenticateToken, TenantController.createTenant);
router.get('/tenants',authenticateToken, TenantController.getTenants);

router.put('/tenants/:id',authenticateToken, TenantController.updateTenant);
router.delete('/tenants/:id',authenticateToken, TenantController.deleteTenant);

export default router;
