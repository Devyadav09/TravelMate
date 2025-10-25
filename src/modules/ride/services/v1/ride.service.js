import {ApiError} from "../../../../utils/ApiError.js"
import { Driver } from "../../../driver/models/driver.model.js"
import { Ride } from "../../../ride/models/ride.model.js"
import { User } from "../../../user/models/user.model.js"
import moment from "moment";
import mongoose from "mongoose";



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


const getDriverRidesService = async({userId})=>{

  const driver = await Driver.findOne({userId})
  if(!driver) throw new ApiError(404,"Driver not found")
  
  const rides = await Ride.find({driverId: driver._id})

  return rides

}


const bookRideService = async ({ userId, rideId }) => {
  const session = await mongoose.startSession()

  try {
    await session.withTransaction(async () => {
      
      const user = await User.findById(userId).session(session)
      if (!user) throw new ApiError(404, "User not found")

      
      const ride = await Ride.findById(rideId)
        .select("status bookedSeats totalSeats passengerIds driverId")
        .session(session);
      if (!ride) throw new ApiError(404, "Ride not found")


      const driver = await Driver.findById(ride.driverId)
        .select("userId")
        .session(session);
      if (!driver) throw new ApiError(404, "Driver not found")
      

      if (user._id.equals(driver.userId)) {
        throw new ApiError(403, "Drivers cannot book their own rides")
      }
    
      if (ride.status !== "published") {
        throw new ApiError(400, "Ride is not available for booking")
      }

      // Prevent duplicate booking
      const alreadyBooked = ride.passengerIds.some(
        (id) => id.toString() === userId.toString()
      );
      if (alreadyBooked) {
        throw new ApiError(400, "User has already booked this ride")
      }

      // Try atomic update (seat check + booking in one DB operation)
      const updateResult = await Ride.updateOne(
        {
          _id: rideId,
          bookedSeats: { $lt: ride.totalSeats }, // only if seats left
          status: "published",
        },
        {
          $inc: { bookedSeats: 1 },
          $push: { passengerIds: userId },
        },
        { session }
      )

      // If no document was modified, ride was full or condition failed
      if (updateResult.matchedCount === 0) {
        throw new ApiError(400, "No seats available or ride not bookable")
      }
    })

    // Fetch populated ride after transaction
    const populatedRide = await Ride.findById(rideId)
      .populate({
        path: "driverId",
        select: "vehicleDetails licenseNumber userId",
        populate: {
          path: "userId",
          select: "name email phone"
        }
      })
      .populate("passengerIds", "firstName lastName email")

    return {
      message: "Ride booked successfully",
      ride: populatedRide,
    };

  } catch (error) {
    if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error")
  } finally {
    session.endSession();
  }
}


const cancelRideService = async ({ userId, rideId }) => {
  const session = await mongoose.startSession()
  try {
    await session.withTransaction(async () => {
      // Validate user exists
      const user = await User.findById(userId).session(session)
      if (!user) throw new ApiError(404, "User not found")

      // Fetch ride details
      const ride = await Ride.findById(rideId)
        .select("status bookedSeats availableSeats passengerIds driverId")
        .session(session);
      if (!ride) throw new ApiError(404, "Ride not found")

      // Check if ride can be cancelled
      if (ride.status === "completed") {
        throw new ApiError(400, "Cannot cancel a completed ride")
      }
      if (ride.status === "cancelled") {
        throw new ApiError(400, "Ride is already cancelled")
      }

      // Check if user has booked this ride
      const isBooked = ride.passengerIds.some(
        (id) => id.toString() === userId.toString()
      );
      if (!isBooked) {
        throw new ApiError(400, "You have not booked this ride")
      }

      // Atomic update: Remove passenger and decrement booked seats
      const updateResult = await Ride.updateOne(
        {
          _id: rideId,
          passengerIds: userId, // Ensure passenger is still in the list
        },
        {
          $pull: { passengerIds: userId }, // Remove passenger
          $inc: { bookedSeats: -1 }, // Decrement booked seats
        },
        { session }
      );

      // Check if update was successful
      if (updateResult.matchedCount === 0) {
        throw new ApiError(400, "Failed to cancel booking. Ride may have been modified.");
      }

    })

    // Fetch updated ride details after transaction
    const updatedRide = await Ride.findById(rideId)
      .populate({
        path: "driverId",
        select: "vehicleDetails licenseNumber userId",
        populate: {
          path: "userId",
          select: "name email phone"
        }
      })
      .populate("passengerIds", "firstName lastName email");

    return {
      message: "Ride booking cancelled successfully",
      ride: updatedRide,
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    console.error("Cancel ride error:", error)
    throw new ApiError(500, "Internal Server Error")
  } finally {
    session.endSession();
  }
}

export {
    createRideService,
    searchRidesService,
    getDriverRidesService,
    bookRideService,
    cancelRideService
}