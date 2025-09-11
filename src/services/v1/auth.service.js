import { asyncHandler } from "../../utils/asyncHandler.js";
import {ApiError} from "../../utils/ApiError.js"
import { User} from "../../models/user.model.js"
import { ApiResponse } from "../../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose"


const generateAccessTokenAndRefreshToken = async (userId)=> {

    try{

        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}

    }catch(error){
        throw new ApiError(500,"something went wrong while generating referesh and access token")
    }

}


const loginUserService = async({email, userName, password})=>{

    try{

        const user = await User.findOne({
            $or:[{email},{userName}]
        })

        if(!user) throw new ApiError(404,"User Not Found")

        const isPasswordValid = await user.isPasswordCorrect(password)
        
        if(!isPasswordValid) throw new ApiError(401, "Invalid Credentials Please Try Again")

        const {refreshToken, accessToken} = await generateAccessTokenAndRefreshToken(user._id)

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

        return{
            user: loggedInUser,
            refreshToken,
            accessToken
        }
    }catch(error){
        throw new ApiError(500,"Internal Server Error")
    }
}


const logoutUserService = async({_id})=>{
    
    try{
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
            $unset: {
                refreshToken: 1 // this removes field from documents
            }
            },
            {
            new: true
            }
        );

        if (!updatedUser) {
            throw new Error("User not found");
        }

        return { success: true, message: "User logged out successfully" };
    }catch(error){
        throw new ApiError(500,"Internal Server Error")
    }
}


const deleteUserService = async({_id})=>{
    try{
        const deletedUser = await User.findByIdAndDelete(_id)

        if(!deletedUser){
            throw new ApiError(404, "User Not Found")
        }

        return { 
        success: true, 
        message: "User deleted successfully",
        deletedUser: {
                _id: deletedUser._id,
                userName: deletedUser.userName,
                email: deletedUser.email
            }
        };

    }catch(error){
        throw new ApiError(500, "Internal Server Error")
    }
}

export {
    loginUserService,
    logoutUserService,
    deleteUserService
}