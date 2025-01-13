import { Router } from "express";
import AuthRoutes from "./authRoutes";
import vendorRoutes from './vendorRoutes'
// import UserRoutes from "./userRoutes";


const router = Router();

router.use("/auth", AuthRoutes);
router.use("/vendor", vendorRoutes);


// router.use("/data", dataRoutes);

// router.use("/user", UserRoutes);


export default router;
