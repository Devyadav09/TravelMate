import {Router} from "express";
import {registerUser} from "../../controllers/v1/user.controller.js"


const router = Router()

router.route("/register").post(registerUser)


export default router;