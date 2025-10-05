import { asyncHandler } from "../../utils/asyncHandler.js"
import {ApiError} from "../../utils/ApiError.js"
import { User} from "../../models/user.model.js"
import { Driver } from "../../models/driver.model.js"
import { Ride } from "../../models/ride.model.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import validator from "validator"
import moment from "moment";




const createRideService = async({userId, rideDetails})=>{

    try{

        const driver = await Driver.findOne({userId})
        if(!driver) throw new ApiError(403, "User is not registered as driver")
        
        // Check if driver has any existing or ongoing ride
        const hasActiveRide = await Ride.exists({
          driverId: driver._id,
          status: { $in: ["published", "ongoing"] }
        });

        if (hasActiveRide) {
          throw new ApiError(
            409,
            "You already have an active ride. Please complete or cancel your existing ride before creating a new one."
          );
        }

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


// const searchRidesService = async (query) => {
//   const {
//     fromLng,
//     fromLat,
//     toLng,
//     toLat,
//     arrivalTime, 
//     rideDate,    
//     maxDistanceFrom = 10000, // 10 km default
//     maxDistanceTo = 10000    // 10 km default
//   } = query;

//   // Validate required fields
//   if (!arrivalTime) throw new ApiError(400, "arrivalTime is required");
//   if (!rideDate) throw new ApiError(400, "rideDate is required");

//   const targetArrivalTime = moment(arrivalTime, "HH:mm").toDate();
//   const targetDate = moment(rideDate, "YYYY-MM-DD").startOf("day").toDate();
//   const endOfDay = moment(rideDate, "YYYY-MM-DD").endOf("day").toDate();

//   const rides = await Ride.aggregate([
//     //Find rides starting near the departure point
//     {
//       $geoNear: {
//         near: { type: "Point", coordinates: [parseFloat(fromLng), parseFloat(fromLat)] },
//         distanceField: "departureDistance",
//         maxDistance: parseFloat(maxDistanceFrom),
//         spherical: true,
//         key: "departureLocation"
//       }
//     },

//     //Match rides that end near the destination and have valid date/time
//     {
//       $match: {
//         "arrivalLocation.coordinates": {
//           $geoWithin: {
//             $centerSphere: [[parseFloat(toLng), parseFloat(toLat)], 10 / 6378.1] // 10km radius
//           }
//         },
//         rideDate: { $gte: targetDate, $lte: endOfDay }, // Same-day rides
//         arrivalTime: { $gte: targetArrivalTime },       // rides arriving after or equal to input time
//         availableSeats: { $gt: 0 },
//         status: "published"
//       }
//     },

//     //Sort by closest departure
//     {
//       $sort: { departureDistance: 1, arrivalTime: 1 }
//     }
//   ]);


//   return rides;
// }


// const searchRidesService = async (query) => {
//   const {
//     fromLng,
//     fromLat,
//     toLng,
//     toLat,
//     arrivalTime, // ISO string: "2025-10-05T11:00:00.000Z"
//     maxDistanceFrom = 10000, // 10 km
//     maxDistanceTo = 10000
//   } = query;

//   // Validate required fields
//   if (!arrivalTime) throw new ApiError(400, "arrivalTime is required");
//   if (!fromLng || !fromLat) throw new ApiError(400, "Departure location is required");
//   if (!toLng || !toLat) throw new ApiError(400, "Destination location is required");

//   // Parse the requested arrival time
//   const requestedArrivalTime = moment(arrivalTime).toDate();
  
//   // Optional: Add a time window (e.g., ±2 hours flexibility)
//   const minArrivalTime = moment(arrivalTime).subtract(30, 'minutes').toDate();
//   const maxArrivalTime = moment(arrivalTime).add(2, 'hours').toDate();

//   const rides = await Ride.aggregate([
//     // Stage 1: Find rides starting near the departure point
//     {
//       $geoNear: {
//         near: { 
//           type: "Point", 
//           coordinates: [parseFloat(fromLng), parseFloat(fromLat)] 
//         },
//         distanceField: "departureDistance",
//         maxDistance: parseFloat(maxDistanceFrom),
//         spherical: true,
//         key: "departureLocation",
//         query: {
//           status: "published",
//           availableSeats: { $gt: 0 },
//           // Only show future rides (departure time hasn't passed)
//           departureTime: { $gte: new Date() }
//         }
//       }
//     },
    
//     // Stage 2: Calculate distance to destination
//     {
//       $addFields: {
//         arrivalDistance: {
//           $sqrt: {
//             $add: [
//               {
//                 $pow: [
//                   {
//                     $subtract: [
//                       { $arrayElemAt: ["$arrivalLocation.coordinates", 0] },
//                       parseFloat(toLng)
//                     ]
//                   },
//                   2
//                 ]
//               },
//               {
//                 $pow: [
//                   {
//                     $subtract: [
//                       { $arrayElemAt: ["$arrivalLocation.coordinates", 1] },
//                       parseFloat(toLat)
//                     ]
//                   },
//                   2
//                 ]
//               }
//             ]
//           }
//         }
//       }
//     },
    
//     // Stage 3: Filter by destination proximity and time
//     {
//       $match: {
//         // Arrival location within radius (approximate, for exact use $geoWithin)
//         arrivalDistance: { $lte: maxDistanceTo / 111000 }, // rough conversion to degrees
        
//         // Match rides arriving in the desired time window
//         arrivalTime: { 
//           $gte: requestedArrivalTime,
//           $lte: maxArrivalTime
//         }
//       }
//     },
    
//     // Stage 4: Sort by relevance (closest departure, then earliest arrival)
//     {
//       $sort: { 
//         departureDistance: 1, 
//         arrivalTime: 1 
//       }
//     },
    
//     // Stage 5: Limit results for performance
//     {
//       $limit: 50
//     },
    
//     // Stage 6: Populate driver information (optional)
//     {
//       $lookup: {
//         from: "users",
//         localField: "driver",
//         foreignField: "_id",
//         as: "driverInfo"
//       }
//     },
    
//     // Stage 7: Format output
//     {
//       $project: {
//         departureLocation: 1,
//         arrivalLocation: 1,
//         departureTime: 1,
//         arrivalTime: 1,
//         availableSeats: 1,
//         pricePerSeat: 1,
//         departureDistance: 1,
//         arrivalDistance: 1,
//         status: 1,
//         vehicle: 1,
//         "driverInfo.userName": 1,
//         "driverInfo.profilePicture": 1,
//         "driverInfo.rating": 1
//       }
//     }
//   ]);

//   return rides;
// };


const searchRidesService = async (query) => {
  const {
    fromLng,
    fromLat,
    toLng,
    toLat,
    arrivalTime,
    maxDistanceFrom = 10000, // 10 km
    maxDistanceTo = 10000,
    minSeats = 1
  } = query;

  // Validate required fields
  if (!arrivalTime) throw new ApiError(400, "arrivalTime is required");
  if (!fromLng || !fromLat) throw new ApiError(400, "Departure location is required");
  if (!toLng || !toLat) throw new ApiError(400, "Destination location is required");

  // Parse the requested arrival time
  const requestedArrivalTime = moment(arrivalTime).toDate();
  const maxArrivalTime = moment(arrivalTime).toDate();

  const rides = await Ride.aggregate([
    // Stage 1: Find rides starting near the departure point
    {
      $geoNear: {
        near: { 
          type: "Point", 
          coordinates: [parseFloat(fromLng), parseFloat(fromLat)] 
        },
        distanceField: "departureDistance",
        maxDistance: parseFloat(maxDistanceFrom),
        spherical: true,
        key: "departureLocation",
        query: {
          status: "published",
          availableSeats: { $gte: minSeats },
          departureTime: { $gte: new Date() }
        }
      }
    },
    
    // Stage 2: Calculate distance to destination
    {
      $addFields: {
        arrivalDistanceInMeters: {
          $multiply: [
            {
              $sqrt: {
                $add: [
                  {
                    $pow: [
                      {
                        $multiply: [
                          {
                            $subtract: [
                              { $arrayElemAt: ["$arrivalLocation.coordinates", 0] },
                              parseFloat(toLng)
                            ]
                          },
                          111320 // meters per degree longitude at equator
                        ]
                      },
                      2
                    ]
                  },
                  {
                    $pow: [
                      {
                        $multiply: [
                          {
                            $subtract: [
                              { $arrayElemAt: ["$arrivalLocation.coordinates", 1] },
                              parseFloat(toLat)
                            ]
                          },
                          110540 // meters per degree latitude
                        ]
                      },
                      2
                    ]
                  }
                ]
              }
            },
            1
          ]
        }
      }
    },
    
    // Stage 3: Filter by destination proximity and time
    {
      $match: {
        arrivalDistanceInMeters: { $lte: parseFloat(maxDistanceTo) },
        arrivalTime: { 
          $gte: requestedArrivalTime,
          $lte: maxArrivalTime
        }
      }
    },
    
    // Stage 4: Lookup Driver Information
    {
      $lookup: {
        from: "drivers", // Driver collection name
        localField: "driverId",
        foreignField: "_id",
        as: "driverDetails"
      }
    },
    
    // Stage 5: Unwind driver details (convert array to object)
    {
      $unwind: {
        path: "$driverDetails",
        preserveNullAndEmptyArrays: false // Skip rides without valid driver
      }
    },
    
    // Stage 6: Lookup User Information (from driver's userId)
    {
      $lookup: {
        from: "users", // User collection name
        localField: "driverDetails.userId",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    
    // Stage 7: Unwind user details
    {
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: false
      }
    },
    
    // Stage 8: Sort by relevance
    {
      $sort: { 
        departureDistance: 1, 
        arrivalTime: 1 
      }
    },
    
    // Stage 9: Limit results for performance
    {
      $limit: 50
    },
    
    // Stage 10: Project final response (shape the data)
    {
      $project: {
        // Ride Information
        _id: 1,
        departureLocation: 1,
        arrivalLocation: 1,
        departureTime: 1,
        arrivalTime: 1,
        availableSeats: 1,
        pricePerSeat: 1,
        status: 1,
        preferences: 1,
        
        // Distance Information
        departureDistance: {
          $round: ["$departureDistance", 2] // in meters
        },
        arrivalDistance: {
          $round: ["$arrivalDistanceInMeters", 2]
        },
        
        // Driver Information
        driver: {
          id: "$driverDetails._id",
          // User Info
          firstName: "$userDetails.firstName",
          lastName: "$userDetails.lastName",
          profilePicture: "$userDetails.profilePicture",
          mobileNumber: "$userDetails.mobileNumber",
          email: "$userDetails.email",
          
          // Vehicle Info
          vehicle: {
            make: "$driverDetails.vehicleDetails.make",
            model: "$driverDetails.vehicleDetails.model",
            plateNumber: "$driverDetails.vehicleDetails.plateNumber",
          }
        },
        
        createdAt: 1
      }
    }
  ]);

  return rides;
};



export {
    createRideService,
    searchRidesService
}