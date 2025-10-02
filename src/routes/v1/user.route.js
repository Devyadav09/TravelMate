import {Router} from "express";
import {login, logout, deleteUser} from "../../controllers/v1/auth.controller.js"
import { verifyJwt } from "../../middlewares/auth.middlewares.js";
import {registerUser, 
    updatedUser, 
    updateUserEmail, 
    updateUserMobileNumber, 
    getAllUsers,
    getCurrentUser,
    changePassword,
    changeUserRoleToDriver

} from "../../controllers/v1/user.controller.js"


const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(login)

// secured routes
router.route("/logout").post(verifyJwt,logout)
router.route("/delete").delete(verifyJwt,deleteUser)
router.route("/update").patch(verifyJwt,updatedUser)
router.route("/changePassword").patch(verifyJwt,changePassword)
router.route("/updateEmail").patch(verifyJwt,updateUserEmail)
router.route("/updateMobileNumber").patch(verifyJwt,updateUserMobileNumber)
router.route("/updateUserRole/:userId").post(verifyJwt,changeUserRoleToDriver)
router.route("/users").get(verifyJwt,getAllUsers)
router.route("/user").get(verifyJwt,getCurrentUser)




export default router;