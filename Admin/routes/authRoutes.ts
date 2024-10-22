import { Router } from "express";
import AuthController from "../controller/AuthController";
import authenticateToken from "../middleware";
const router = Router();

router.post("/getLogin", AuthController.getLogin);

router.get('/test-token', authenticateToken, AuthController.testToken);


// router.post('/delete-user', authenticateToken, AuthController.deleteUser);



export default router
