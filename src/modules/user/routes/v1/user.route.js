import {Router} from "express";
import { verifyJwt } from "../../../../middlewares/auth.middlewares.js";
import {registerUser, 
    updatedUser, 
    updateUserEmail, 
    updateUserMobileNumber, 
    getAllUsers,
    getCurrentUser,
    changePassword,
    changeUserRoleToDriver

} from "../../../user/controllers/v1/user.controller.js"


const router = Router()

router.route("/register").post(registerUser)


// secured routes
router.route("/update").patch(verifyJwt,updatedUser)
router.route("/changePassword").patch(verifyJwt,changePassword)
router.route("/updateEmail").patch(verifyJwt,updateUserEmail)
router.route("/updateMobileNumber").patch(verifyJwt,updateUserMobileNumber)
router.route("/updateUserRole/:userId").post(verifyJwt,changeUserRoleToDriver)
router.route("/users").get(verifyJwt,getAllUsers)
router.route("/user").get(verifyJwt,getCurrentUser)




export default router;