import { asyncHandler } from "../../utils/asyncHandler.js";
import {ApiError} from "../../utils/ApiError.js"
import { User} from "../../models/user.model.js"
import { Driver } from "../../models/driver.model.js"
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import validator from "validator"

const ALLOWED_ROLES = ["user", "driver", "rentalProvider"];


const registerUserService = async({userName, firstName, lastName, email, mobileNumber, password})=>{
    
    try {
        
        const existedUser = await User.findOne({ $or : [{userName}, {email}, {mobileNumber}]})
    
        if(existedUser) throw new ApiError(409, "User with email , mobileNumber or userName already existed")

        // if (!ALLOWED_ROLES.includes(role)) {
        //     throw new ApiError(400, "Invalid role");
        // }
        
        const user = await User.create({
            userName,
            firstName,
            lastName,
            email,
            mobileNumber,
            password,
        })

        return await User.findById(user._id).select("-password -refreshToken")

    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }

}


const updatedUserService = async({userName, firstName, lastName, _id})=>{

    try {

        if(userName){
            const existedUser = await User.findOne({userName})
            
            if(existedUser && !existedUser._id.equals(_id)){
                throw new ApiError(400, "This username is already taken please try something else")
            }
        }
        
        const updatedFields = {}
        if(userName) updatedFields.userName = userName
        if(firstName) updatedFields.firstName = firstName
        if(lastName) updatedFields.lastName = lastName


        const user = await User.findByIdAndUpdate(
            _id,
            { $set: updatedFields },
            {new: true}
        ).select("-password")

        return user

    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }
    
}


const updateUserEmailService = async({email, _id})=>{

    try{

        if(!email){
            throw new ApiError(400, "Email is required")
        }

        if(email){
            const existedUser = await User.findOne({email})

            if(existedUser && !existedUser._id.equals(_id)){
                throw new ApiError(400,"This Email is already taken please try another one")
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
                _id,
                { $set: { email } },
                { new: true }
            ).select("-password")

        return updatedUser

    }catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }
    
}


const updateUserMobileNumberService = async({mobileNumber, _id})=>{

    try{

        if(!mobileNumber){
            throw new ApiError(400, "Mobile Number is required")
        }
    
        if(mobileNumber){

            if(!validator.isMobilePhone(mobileNumber)) {
                throw new ApiError(400, "Please enter a valid mobile number")
            }
            const existedUser = await User.findOne({mobileNumber})

            if(existedUser && !existedUser._id.equals(_id)){
                throw new ApiError(400,"This Mobile Number is already taken please try another one")
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
                _id,
                { $set: { mobileNumber } },
                { new: true }
            ).select("-password")

        return updatedUser

    }catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }
    
}



const getAllUsersService = async()=>{

    try{

        const allUsers = await User.find({}).select("-password -refreshToken")

        return allUsers

    }catch (error) {
        throw new ApiError(500,"Internal Server Error")
    }
}



const getCurrentUserService = async({_id})=>{

    try{

    const user = await User.findById({_id}).select("-password -refreshToken")
    return user

    }catch(error){
        throw new ApiError(500, "Internal Server Error")
    }
}



const changePasswordService = async({_id, oldPassword, newPassword})=>{

    try{

        const user = await User.findById({_id})

        if(!user) throw new ApiError(404, "User not found")

        const updatePassword = await user.isPasswordCorrect(oldPassword)

        if(updatePassword === false) throw new ApiError(401, "Invaild password please enter correct password")

        user.password = newPassword

        await user.save()
        
        return user

    }catch(error){
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }
}


const changeUserRoleToDriverService = async({_id, role, vehicleDetails, licenseNumber}) => {

    try{

        if (!ALLOWED_ROLES.includes(role.toLowerCase())) {
            throw new ApiError(400, "Invalid role");
        }

        const user = await User.findById({_id})
        
        if(!user) throw new ApiError(401, "User not found")
        
        if(role.toLowerCase() == "driver"){
            
            const existingDriver = await Driver.findOne({ userId: _id})
            
            // if(existingDriver) throw new ApiError(400, "Driver is already exist")

            if(existingDriver && user.role == "driver"){
                throw new ApiError(400, "Driver is already exist")
            }

            if(existingDriver && user.role == "user"){
                user.role = role
                await user.save()

                return existingDriver
            }
            
            
            const driver = new Driver({
                userId: _id,
                vehicleDetails,
                licenseNumber
            })

            await driver.save()
            
            user.role = role.toLowerCase()
            await user.save()

            return driver
        }
        
    }catch(error){
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }

    
}





export {

    registerUserService,
    updatedUserService,
    updateUserEmailService,
    updateUserMobileNumberService,
    getAllUsersService,
    getCurrentUserService,
    changePasswordService,
    changeUserRoleToDriverService

}