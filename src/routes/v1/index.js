import { Router } from "express"
import userRoutes from "./user.route.js"
import driverRoutes from "./driver.route.js"
import rideRoutes from "./ride.route.js"

const router = Router()

// All user-related APIs will start with /users
router.use("/users", userRoutes)

router.use("/driver", driverRoutes)

router.use("/ride",rideRoutes)


export default router;
