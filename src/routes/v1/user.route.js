import {Router} from "express";
import {registerUser, 
    updatedUser, 
    updateUserEmail, 
    updateUserMobileNumber, 
    getAllUsers,
    getCurrentUser
} from "../../controllers/v1/user.controller.js"

import {login, logout, deleteUser} from "../../controllers/v1/auth.controller.js"
import { verifyJwt } from "../../middlewares/auth.middlewares.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(login)

// secured routes
router.route("/logout").post(verifyJwt,logout)
router.route("/delete").delete(verifyJwt,deleteUser)
router.route("/update").patch(verifyJwt,updatedUser)
router.route("/update-email").patch(verifyJwt,updateUserEmail)
router.route("/update-mobile-number").patch(verifyJwt,updateUserMobileNumber)
router.route("/users").get(verifyJwt,getAllUsers)
router.route("/user").get(verifyJwt,getCurrentUser)








export default router;