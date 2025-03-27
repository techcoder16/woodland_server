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





    router.post("/party-upsert", authenticateToken,PropertyManageController.upsertPropertyParty);
    router.get("/property-party-get/:propertyId",authenticateToken, PropertyManageController.getPropertyParty);
    router.delete("/property-party-delete/:id",authenticateToken, PropertyManageController.deletePropertyParty);
    
    router.post("/rent", authenticateToken,PropertyManageController.upsertRent);
    router.get("/getRent/:propertyId",authenticateToken, PropertyManageController.getRentData);
    // In your routes file, register the endpoints for supplier upsert and retrieval
router.post("/supplier", authenticateToken, PropertyManageController.upsertSupplier);
router.get("/getSupplier/:id", authenticateToken, PropertyManageController.getSupplierData);

// Tenancy Agreement Endpoints
router.post(
    "/tenancyAgreement",
    authenticateToken,
    PropertyManageController.upsertTenancyAgreement
  );
  router.get( "/getTenancyAgreement/:propertyId",authenticateToken,PropertyManageController.getTenancyAgreementData);
  
  // Management Agreement Endpoints
  router.post(
    "/managementAgreement",
    authenticateToken,
    PropertyManageController.upsertManagementAgreement
  );
  router.get(
    "/getManagementAgreement/:propertyId",
    authenticateToken,
    PropertyManageController.getManagementAgreementData
  );

 
export default router;
