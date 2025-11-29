import {Router} from "express";
import { verifyJwt } from "../../../../middlewares/auth.middlewares.js"
import { authorizeRoles } from "../../../../middlewares/role.middlewares.js"
import { validate } from "../../../../middlewares/validate.middlewares.js"


import { createRideSchema,
    searchRideQuerySchema
 } from "../../../../validations/ride.validation.js"


import { createRide,
    searchRides,
    driverAllRides,
    bookRide,
    cancelRide,
    deleteRide,
    updateRide
 } from "../../../ride/controllers/v1/ride.controller.js"

const router = Router()



router.route("/rides").post(verifyJwt,authorizeRoles("driver"),validate(createRideSchema, "body"),createRide)
router.route("/search").get(verifyJwt,validate(searchRideQuerySchema, "query"),searchRides)
router.route("/driver-rides").get(verifyJwt,authorizeRoles("driver"),driverAllRides)
router.route("/book-ride").post(verifyJwt,bookRide)
router.route("/cancel-ride/:rideId").delete(verifyJwt,cancelRide)
router.route("/delete-ride/:rideId").delete(verifyJwt,authorizeRoles("driver"),deleteRide)
router.route("/update-ride/:rideId").patch(verifyJwt,authorizeRoles("driver"),updateRide)







export default router;

