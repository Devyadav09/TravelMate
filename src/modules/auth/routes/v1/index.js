import { Router } from "express"
import authRoutes from "../../../auth/routes/v1/auth.route.js"


const router = Router()

// All user-related APIs will start with /users
router.use("/auth", authRoutes)


export default router;
