import { asyncHandler } from "../../utils/asyncHandler.js"
import {ApiError} from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { mongo } from "mongoose"
import {registerUserService, 
    updatedUserService, 
    updateUserEmailService, 
    updateUserMobileNumberService, 
    getAllUsersService, 
    getCurrentUserService,
    changePasswordService,
    changeUserRoleToDriverService

} from "../../services/v1/user.service.js"




const registerUser = asyncHandler(async(req,res)=>{
    const {userName, firstName, lastName, password, email, mobileNumber} = req.body

    if([userName ,firstName, password, email, mobileNumber].some(field => !field)){
        throw new ApiError(400, "username, firstname, password, email, mobilenumber is required")
    }

    const user = await registerUserService({userName, firstName, lastName, email, mobileNumber, password})

    if(!user) throw new ApiError(500,"Internal Server Error, Please Try Again")

    return res.status(201).json(new ApiResponse(200, user, "User registered successfully"))

})


const updatedUser = asyncHandler(async(req,res)=>{

    const {userName, firstName, lastName} = req.body

    if(! (userName || firstName || lastName)){
        throw new ApiError(400, "Fields are required")
    }

    const _id = req.user._id
    const updateUser = await updatedUserService({userName, firstName, lastName, _id})

    return res
    .status(200)
    .json(new ApiResponse(200, updateUser, "User details updated successfully"))

})


const updateUserEmail = asyncHandler(async(req,res)=>{
    const {email} = req.body

    if(!email){
        throw new ApiError(400, "Email is required")
    }

    const _id = req.user._id
    const updateEmail = await updateUserEmailService({email, _id})

    return res
    .status(200)
    .json(new ApiResponse(200, updateEmail, "Email Update Successfully"))
})


const updateUserMobileNumber = asyncHandler(async(req,res)=>{
    const {mobileNumber} = req.body

    if(!mobileNumber){
        throw new ApiError(400, "Mobile number is required")
    }

    const _id = req.user._id
    const updateMobileNumber = await updateUserMobileNumberService({mobileNumber, _id})

    return res
    .status(200)
    .json(new ApiResponse(200, updateMobileNumber, "Mobile Number Update Successfully"))
})


const getAllUsers = asyncHandler(async(req,res)=>{

    const users = await getAllUsersService()
    
    return res
    .status(200)
    .json(new ApiResponse(200, users, 'All users retrive successfully'))

})


const getCurrentUser = asyncHandler(async(req,res)=>{

    const _id = req.user._id

    const user = await getCurrentUserService({_id})

    if(!user){
        throw new ApiError(404, "No User found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, user, "User found successfully"))

})



const changePassword = asyncHandler(async(req,res)=>{

    const {oldPassword, newPassword} = req.body

    if(!(oldPassword || newPassword)) throw new ApiError(400, "Password is required")

    const _id = req.user._id

    const updateUserPassword = await changePasswordService({_id, oldPassword, newPassword})

    return res
    .status(200)
    .json( new ApiResponse(200, updateUserPassword, "Password Update Successfully"))

})



const changeUserRoleToDriver = asyncHandler(async(req,res)=>{

    const _id = req.user._id

    const { userId } = req.params
    
    if(_id != userId) throw new ApiError(401, "Unauthorized")

    const {role, vehicleDetails, licenseNumber} = req.body

    if(!(role && vehicleDetails && licenseNumber)) throw new ApiError(400, "user role, vehicle details and license number is required")

    const updateUserRole = await changeUserRoleToDriverService({_id, role, vehicleDetails, licenseNumber})

    if (!updateUserRole) throw new ApiError(500, "Internal Server Error")

    return res
    .status(200)
    .json(new ApiResponse(200, updateUserRole, "User Role Update Successfully"))
})


export {
    registerUser,
    updatedUser,
    updateUserEmail,
    updateUserMobileNumber,
    getAllUsers,
    getCurrentUser,
    changePassword,
    changeUserRoleToDriver
}