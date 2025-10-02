import {Router} from "express";
import { verifyJwt } from "../../middlewares/auth.middlewares.js"
import { authorizeRoles } from "../../middlewares/role.middlewares.js"
import {changeDriverRoleToUser,
    updateVehicleDetails
} from "../../controllers/v1/driver.controller.js"

const router = Router()

router.route("/changeDriverRole/:userId").patch(verifyJwt,authorizeRoles("driver"),changeDriverRoleToUser)
router.route("/updateVehicleDetails/:driverId").patch(verifyJwt,authorizeRoles("driver"),updateVehicleDetails)





export default router;

