import { Router } from "express";
import AuthRoutes from "./authRoutes";
import vendorRoutes from './vendorRoutes'
// import UserRoutes from "./userRoutes";
import propertyRoutes from './propertyRoutes'

import mangerRoutes from "./mangerRoutes";
import tenantRoutes from './tenantRoutes';
const router = Router();

router.use("/auth", AuthRoutes);
router.use("/vendor", vendorRoutes);
router.use("/property", propertyRoutes);

router.use("/manager",mangerRoutes);

router.use("/tenantn",tenantRoutes);

// router.use("/data", dataRoutes);

// router.use("/user", UserRoutes);


export default router;
