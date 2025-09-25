import mongoose, { Schema } from "mongoose";
import moment from "moment";  

const rideSchema = new Schema(
  {
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "Driver", 
      required: true
    },

    departureLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true },
    },

    arrivalLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true },
    },

    departureTime: { 
      type: Date, 
      required: true 
    },

    arrivalTime: { 
      type: Date 
    },

    pricePerSeat: { 
      type: Number, 
      required: true, 
      min: 0 
    },

    availableSeats: { 
      type: Number, 
      required: true, 
      min: 1 
    },

    bookedSeats: { 
      type: Number, 
      default: 0, 
      min: 0 
    },

    status: {
      type: String,
      enum: ["published", "ongoing", "completed", "cancelled"],
      default: "published",
    },

    passengerIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },

  {
    timestamps: true,
    
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        // remove unwanted fields
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;

        // format dates
        if (ret.departureTime) {
          ret.departureTime = moment(ret.departureTime).format("YYYY-MM-DD hh:mm A");
        }
        if (ret.arrivalTime) {
          ret.arrivalTime = moment(ret.arrivalTime).format("YYYY-MM-DD hh:mm A");
        }

        return ret;
      }
    },
    toObject: { virtuals: true },
  }
);



// Validation Hook
rideSchema.pre("save", function (next) {
  if (this.bookedSeats > this.availableSeats) {
    return next(new Error("Booked seats cannot exceed available seats"));
  }
  next();
});



// Virtual Field
rideSchema.virtual("remainingSeats").get(function () {
  return this.availableSeats - this.bookedSeats;
});



export const Ride = mongoose.model("Ride", rideSchema);
