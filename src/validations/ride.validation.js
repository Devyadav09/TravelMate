import Joi from "joi";


const locationSchema = Joi.object({
  coordinates: Joi.array()
    .ordered(
      Joi.number().min(-180).max(180).required(), // lng
      Joi.number().min(-90).max(90).required()    // lat
    )
    .length(2) // must be [lng, lat]
    .required(),
  address: Joi.string().required()
});


//Joi schema for ride creation
const createRideSchema = Joi.object({
    
  departureLocation: locationSchema.required(),
  arrivalLocation: locationSchema.required(),

  departureTime: Joi.date().greater("now").required().messages({
    "date.greater": "Departure time must be in the future",
  }),

  arrivalTime: Joi.date().greater(Joi.ref("departureTime")).optional().messages({
    "date.greater": "Arrival time must be after departure time",
  }),

  rideDate: Joi.date().iso().required(),

  pricePerSeat: Joi.number().min(0).required(),
  availableSeats: Joi.number().min(1).required(),


})



const searchRideQuerySchema = Joi.object({
  fromLng: Joi.number().min(-180).max(180).required(),
  fromLat: Joi.number().min(-90).max(90).required(),
  toLng: Joi.number().min(-180).max(180).required(),
  toLat: Joi.number().min(-90).max(90).required(),
  arrivalTime: Joi.date().iso().required().messages({
    "any.required": "arrivalTime is required",
    "date.format": "arrivalTime must be a valid ISO date"
  }),
  rideDate: Joi.date().iso().required().messages({
    "any.required": "rideDate is required",
    "date.format": "rideDate must be a valid ISO date"
  }),
  maxDistanceFrom: Joi.number().min(100).max(50000).default(10000),
  maxDistanceTo: Joi.number().min(100).max(50000).default(10000)
});




export {
    createRideSchema,
    searchRideQuerySchema
}
