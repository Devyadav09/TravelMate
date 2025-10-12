import { Router } from "express"
import driverRoutes from "../../../driver/routes/v1/driver.route.js"


const router = Router()


router.use("/driver", driverRoutes)

export default router;
