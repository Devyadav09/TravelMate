import mongoose, { Schema } from "mongoose";

const driverSchema = new Schema(
  {

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one-to-one with User
    },

    vehicleDetails: {
        make: {
            type: String,     // company name like toyota
            trim: true,
        },
        model: {
            type: String,      // car name like fourtanure
            trim: true,
        },
        color: {
            type: String,
            trim: true,
        },
        plateNumber: {
            type: String,
            required: [true, "Vehicle plate number is required"],
            trim: true,
            unique: true, // optional: ensures no two vehicles have the same plate number
        },
    },


    licenseNumber: {
      type: String,
      required: true,
    },

    // rating: {
    //   type: Number,
    //   default: 0,
    // },

    // reviewCount: {
    //   type: Number,
    //   default: 0,
    // },

    activeRides: [
      {
        type: Schema.Types.ObjectId,
        ref: "Ride",
      },
    ],

  },

  {
    timestamps:true,

    toJSON: {
      transform: function(doc, ret) {
        delete ret.createdAt
        delete ret.updatedAt
        delete ret.__v
        return ret
      }
    }
  }

  


)

export const Driver = mongoose.model("Driver", driverSchema)
