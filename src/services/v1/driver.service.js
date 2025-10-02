import { asyncHandler } from "../../utils/asyncHandler.js"
import {ApiError} from "../../utils/ApiError.js"
import { User} from "../../models/user.model.js"
import { Driver } from "../../models/driver.model.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import validator from "validator"

const ALLOWED_ROLES = ["user", "driver", "rentalProvider"];



const changeDriverRoleToUserService = async({userId, role})=>{

    try{
        
        if (!ALLOWED_ROLES.includes(role.toLowerCase())) {
            throw new ApiError(400, "Invalid role");
        }

        if(role.toLowerCase() == 'user'){

            const driver = await Driver.findOne({userId: userId})
            
            if(!driver) throw new ApiError(401, "Driver not found")
        }

        const user = await User.findById({_id: userId})
        
        user.role = role.toLowerCase()
        await user.save()
        
        return user

    }catch(error){
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }
}



const updateVehicleDetailsService = async({_id, vehicleDetails})=>{
    try{

        const driverVehicle = await Driver.findById({_id})

        if(!driverVehicle) throw new ApiError(404, "Driver ID is required")

        for (let key in vehicleDetails) {
            if (vehicleDetails.hasOwnProperty(key) && vehicleDetails[key] !== undefined) {
                driverVehicle.vehicleDetails[key] = vehicleDetails[key];
            }
        }

        await driverVehicle.save();

        return driverVehicle

    }catch(error){
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }
}



export{
    changeDriverRoleToUserService,
    updateVehicleDetailsService
}