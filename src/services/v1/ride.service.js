import { asyncHandler } from "../../utils/asyncHandler.js"
import {ApiError} from "../../utils/ApiError.js"
import { User} from "../../models/user.model.js"
import { Driver } from "../../models/driver.model.js"
import { Ride } from "../../models/ride.model.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import validator from "validator"


const createRideService = async({userId, rideDetails})=>{

    try{

        const driver = await Driver.findOne({userId})
        if(!driver) throw new ApiError(403, "User is not registered as driver")
        
        const newRide = await Ride.create({
            driverId: driver._id,     
            ...rideDetails,
        });
        
        driver.activeRides.push(newRide._id);
        await driver.save();

        return newRide
        
    }catch(error){
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }

}


// const getRidesService = async()


export {
    createRideService
}