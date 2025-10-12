import {Router} from "express";
import {login, logout, deleteUser} from "../../../auth/controllers/v1/auth.controller.js"
import { verifyJwt } from "../../../../middlewares/auth.middlewares.js";



const router = Router()

router.route("/login").post(login)

// secured routes
router.route("/logout").post(verifyJwt,logout)
router.route("/delete").delete(verifyJwt,deleteUser)



export default router;