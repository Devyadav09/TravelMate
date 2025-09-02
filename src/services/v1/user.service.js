import { asyncHandler } from "../../utils/asyncHandler.js";
import {ApiError} from "../../utils/ApiError.js"
import { User} from "../../models/user.model.js"
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";


const registerUserService = async({userName, firstName, lastName, email, mobileNumber, password })=>{
    
    const existedUser = await User.findOne({ $or : [{userName}, {email}, {mobileNumber}]})
    
    if(existedUser) throw new ApiError(409, "User with email , mobileNumber or userName already existed")

    const user = await User.create({
        userName,
        firstName,
        lastName,
        email,
        mobileNumber,
        password
    })

    return await User.findById(user._id).select("-password -refreshToken")

}



export {

    registerUserService
}