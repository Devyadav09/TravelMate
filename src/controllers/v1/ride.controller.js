import { asyncHandler } from "../../utils/asyncHandler.js"
import {ApiError} from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { mongo } from "mongoose"
import {createRideService} from "../../services/v1/ride.service.js"
import { Driver } from "../../models/driver.model.js"



const createRide = asyncHandler(async(req,res)=>{

    const userId = req.user._id
    if (req.user.role !== 'driver') throw new ApiError(403, "Only drivers can create ride")

    const ride = await createRideService({userId, rideDetails: req.body})

    if(!ride) throw new ApiError(500,"Internal Server Error")

    return res
    .status(200)
    .json( new ApiResponse(200, ride, "Ride create successfully"))

})



export {
    createRide
}