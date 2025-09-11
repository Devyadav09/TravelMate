import { asyncHandler } from "../../utils/asyncHandler.js";
import {ApiError} from "../../utils/ApiError.js"
import { User} from "../../models/user.model.js"
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import validator from "validator"



const registerUserService = async({userName, firstName, lastName, email, mobileNumber, password })=>{
    
    try {
        
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

    } catch (error) {
        throw new ApiError(500,"Internal Server Error")
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
        throw new ApiError(500,"Internal Server Error")
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
        throw new ApiError(500,"Internal Server Error")
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
        throw new ApiError(500,"Internal Server Error")
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



export {

    registerUserService,
    updatedUserService,
    updateUserEmailService,
    updateUserMobileNumberService,
    getAllUsersService

}