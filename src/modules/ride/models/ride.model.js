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
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      },
      address: { type: String, required: true }
    },

    arrivalLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      },
      address: { type: String, required: true }
    },

    departureTime: {
      type: Date,
      required: true,
      index: true
    },

    arrivalTime: { 
      type: Date,
      required: true,
      index: true
    },

    rideDate: {
      type: Date,
      required: true
    },

    pricePerSeat: {
      type: Number,
      required: true,
      min: 0
    },

    totalSeats: {
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
      default: "published"
    },

    passengerIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.__v;
        delete ret.id;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

//Add GeoSpatial Indexes
rideSchema.index({ departureLocation: "2dsphere" });
rideSchema.index({ arrivalLocation: "2dsphere" });
rideSchema.index({ departureTime: 1, status: 1 });
rideSchema.index({ arrivalTime: 1, status: 1 });
rideSchema.index({ driverId: 1, status: 1 });



// Validation Hook
rideSchema.pre("save", function (next) {
  if (this.bookedSeats > this.totalSeats) {
    return next(new Error("Booked seats cannot exceed available seats"));
  }
  next();
});

// Virtual Field
rideSchema.virtual("remainingSeats").get(function () {
  return this.totalSeats - this.bookedSeats;
});

export const Ride = mongoose.model("Ride", rideSchema);
