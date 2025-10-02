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

  pricePerSeat: Joi.number().min(0).required(),
  availableSeats: Joi.number().min(1).required(),


})


export {
    createRideSchema
}
