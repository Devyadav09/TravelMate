import {Router} from "express";
import { verifyJwt } from "../../middlewares/auth.middlewares.js"
import { authorizeRoles } from "../../middlewares/role.middlewares.js"
import { validate } from "../../middlewares/validate.middlewares.js"
import { createRideSchema } from "../../validations/ride.validation.js"
import { createRide } from "../../controllers/v1/ride.controller.js"

const router = Router()

router.route("/rides").post(verifyJwt,authorizeRoles("driver"),validate(createRideSchema, "body"),createRide)




export default router;

