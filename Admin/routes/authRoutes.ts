import { Router } from "express";
import AuthController from "../controller/AuthController";
import authenticateToken from "../middleware";
const router = Router();

router.post("/getLogin", AuthController.getLogin);

router.get('/test-token', authenticateToken, AuthController.testToken);


router.post("/update-password",authenticateToken, AuthController.updatePassword);


router.post("/update-metadata",authenticateToken, AuthController.updateMetaData);

// router.post('/delete-user', authenticateToken, AuthController.deleteUser);



export default router
