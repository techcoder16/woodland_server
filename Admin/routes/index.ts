import { Router } from "express";
import AuthRoutes from "./authRoutes";

// import UserRoutes from "./userRoutes";


const router = Router();

router.use("/auth", AuthRoutes);

// router.use("/data", dataRoutes);

// router.use("/user", UserRoutes);


export default router;
