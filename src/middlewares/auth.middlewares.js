import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";


export const verifyJwt = asyncHandler(async(req,res,next)=>{

    try{

        const token = req.cookies?.accessToken || req.header("Authorization")?.header("Bearer","")

        if(!token){
            throw new ApiError(401, "Unauthorization request please try again")
        }

        const decodeToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodeToken?._id).select("-password --refreshToken")

        if(!user){
            throw new ApiError(401, "Invaild Access Token")
        }

        req.user = user
        next()

    }catch (error){
        throw new ApiError(401,error?.message || "Invaild Access Token")
    }

})