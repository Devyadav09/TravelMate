import { asyncHandler } from "../../utils/asyncHandler.js"
import {ApiError} from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import {registerUserService} from "../../services/v1/user.service.js"


const registerUser = asyncHandler(async(req,res)=>{
    const {userName, firstName, lastName, password, email, mobileNumber} = req.body

    if([userName ,firstName, password, email, mobileNumber].some(field => !field)){
        throw new ApiError(400, "username, firstname, password, email, mobilenumber is required")
    }

    const user = await registerUserService({userName, firstName, lastName, email, mobileNumber, password})

    if(!user) throw new ApiError(500,"Internal Server Error, Please Try Again")

    return res.status(201).json(new ApiResponse(200, user, "User registered successfully"))

})


export {
    registerUser
}