import { asyncHandler } from "../../../../utils/asyncHandler.js"
import {ApiError} from "../../../../utils/ApiError.js"
import { ApiResponse } from "../../../../utils/ApiResponse.js"

import {createRideService,
    searchRidesService,
    getDriverRidesService,
    bookRideService,
    cancelRideService
} from "../../../ride/services/v1/ride.service.js"



const createRide = asyncHandler(async(req,res)=>{

    const userId = req.user._id
    if (req.user.role !== 'driver') throw new ApiError(403, "Only drivers can create ride")

    const ride = await createRideService({userId, rideDetails: req.body})

    if(!ride) throw new ApiError(500,"Internal Server Error")

    return res
    .status(200)
    .json( new ApiResponse(200, ride, "Ride create successfully"))

})



const searchRides = asyncHandler(async (req, res, next) => {
  try {
    const rides = await searchRidesService(req.query); // GET query params
    res.status(200).json({
      success: true,
      statuscode: 200,
      message: "Rides fetched successfully",
      data: rides
    });
  } catch (error) {
    next(new ApiError(error.statusCode || 500, error.message || "Internal Server Error"));
  }
})



const driverAllRides = asyncHandler(async(req,res)=>{

  const userId = req.user._id
  if (req.user.role !== 'driver') throw new ApiError(403, "Only drivers can see there rides")

  const rides = await getDriverRidesService({userId})

  return res
  .status(200)
  .json(new ApiResponse(200, rides, "All Rides Fetch Successfully"))

})



const bookRide = asyncHandler(async(req,res)=>{

    const userId = req.user._id
    const { rideId } = req.body

    const bookRide = await bookRideService({userId, rideId})

    if(!bookRide) throw new ApiError(500, 'Internal Server Error')

    return res
    .status(201)
    .json(new ApiResponse(201, bookRide, "Ride Booked Successfully"))

})


const cancelRide = asyncHandler(async(req,res)=>{

    const userId = req.user._id
    const { rideId } = req.body

    const cancelRide = await cancelRideService({userId, rideId})

    if(!cancelRide) throw new ApiError(500, 'Internal Server Error')

    return res
    .status(201)
    .json(new ApiResponse(201, cancelRide, "Ride Cancel Successfully"))

})




export {
    createRide,
    searchRides,
    driverAllRides,
    bookRide,
    cancelRide
}