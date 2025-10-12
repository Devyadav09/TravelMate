import { Router } from "express"
import rideRoutes from "../../../ride/routes/v1/ride.route"

const router = Router()

router.use("/ride",rideRoutes)


export default router;
