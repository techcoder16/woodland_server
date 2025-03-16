import express from 'express';
import PropertyManageController from '../controller/PropertyManageController';
import authenticateToken from "../middleware";
import { upload } from '../utils/multerConfig';

const router = express.Router();

// -----------------------------
// Additional Property Feature Routes
// -----------------------------    
router.post('/features/upsert', authenticateToken,upload.array('map', 15), PropertyManageController.upsertFeature);

router.get('/features', authenticateToken, PropertyManageController.getFeatures);


// -----------------------------
// Property Party Routes
// -----------------------------
router.get('/parties', authenticateToken, PropertyManageController.getPropertyParties);
router.put('/parties/update/:id', authenticateToken, PropertyManageController.updatePropertyParty);
router.delete('/parties/delete/:id', authenticateToken, PropertyManageController.deletePropertyParty);

// -----------------------------
// Lease Routes
// -----------------------------
router.post('/leases/create', authenticateToken, PropertyManageController.createLease);
router.get('/leases', authenticateToken, PropertyManageController.getLeases);
router.put('/leases/update/:id', authenticateToken, PropertyManageController.updateLease);
router.delete('/leases/delete/:id', authenticateToken, PropertyManageController.deleteLease);

// -----------------------------
// Meter Routes
// -----------------------------
router.post('/meters/create', authenticateToken, PropertyManageController.createMeter);
router.get('/meters', authenticateToken, PropertyManageController.getMeters);
router.put('/meters/update/:id', authenticateToken, PropertyManageController.updateMeter);
router.delete('/meters/delete/:id', authenticateToken, PropertyManageController.deleteMeter);

// -----------------------------
// Management Agreement Routes
// -----------------------------
router.post('/management-agreements/create', authenticateToken, PropertyManageController.createManagementAgreement);
router.get('/management-agreements', authenticateToken, PropertyManageController.getManagementAgreements);
router.put('/management-agreements/update/:id', authenticateToken, PropertyManageController.updateManagementAgreement);
router.delete('/management-agreements/delete/:id', authenticateToken, PropertyManageController.deleteManagementAgreement);

// -----------------------------
// Tenancy Agreement Routes
// -----------------------------
router.post('/tenancy-agreements/create', authenticateToken, PropertyManageController.createTenancyAgreement);
router.get('/tenancy-agreements', authenticateToken, PropertyManageController.getTenancyAgreements);
router.put('/tenancy-agreements/update/:id', authenticateToken, PropertyManageController.updateTenancyAgreement);
router.delete('/tenancy-agreements/delete/:id', authenticateToken, PropertyManageController.deleteTenancyAgreement);

// -----------------------------
// Transaction Routes
// -----------------------------
router.post('/transactions/create', authenticateToken, PropertyManageController.createTransaction);
router.get('/transactions', authenticateToken, PropertyManageController.getTransactions);
router.put('/transactions/update/:id', authenticateToken, PropertyManageController.updateTransaction);
router.delete('/transactions/delete/:id', authenticateToken, PropertyManageController.deleteTransaction);

// -----------------------------
// Note Routes
// -----------------------------
router.post('/notes/create', authenticateToken, PropertyManageController.createNote);
router.get('/notes', authenticateToken, PropertyManageController.getNotes);
router.put('/notes/update/:id', authenticateToken, PropertyManageController.updateNote);
router.delete('/notes/delete/:id', authenticateToken, PropertyManageController.deleteNote);

// -----------------------------
// History Routes
// -----------------------------
router.post('/histories/create', authenticateToken, PropertyManageController.createHistory);
router.get('/histories', authenticateToken, PropertyManageController.getHistories);
router.put('/histories/update/:id', authenticateToken, PropertyManageController.updateHistory);
router.delete('/histories/delete/:id', authenticateToken, PropertyManageController.deleteHistory);

export default router;
