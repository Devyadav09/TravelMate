import express from "express";
import userRoutes from "../modules/user/routes/v1/user.route.js";
import driverRoutes from "../modules/driver/routes/v1/driver.route.js";
import rideRoutes from "../modules/ride/routes/v1/ride.route.js";
import authRoutes from "../modules/auth/routes/v1/auth.route.js";

const router = express.Router();


router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/drivers", driverRoutes);
router.use("/rides", rideRoutes);

export default router;
