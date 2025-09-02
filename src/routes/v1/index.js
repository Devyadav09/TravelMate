import { Router } from "express";
import userRoutes from "./user.route.js";

const router = Router();

// All user-related APIs will start with /users
router.use("/users", userRoutes);


export default router;
