import {Router} from "express";
import { verifyJwt } from "../../middlewares/auth.middlewares.js"
import { authorizeRoles } from "../../middlewares/role.middlewares.js"
import { validate } from "../../middlewares/validate.middlewares.js"


import { createRideSchema,
    searchRideQuerySchema
 } from "../../validations/ride.validation.js"


import { createRide,
    searchRides,
    driverAllRides
 } from "../../../ride/controllers/v1/ride.controller.js"

const router = Router()



router.route("/rides").post(verifyJwt,authorizeRoles("driver"),validate(createRideSchema, "body"),createRide)
router.route("/search").get(verifyJwt,validate(searchRideQuerySchema, "query"),searchRides)
router.route("/driver-rides").get(verifyJwt,authorizeRoles("driver"),driverAllRides)





export default router;

