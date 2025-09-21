import mongoose, {Schema} from "mongoose"
import validator from "validator"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
            minlength: 3,
            maxlength: 50
        },

        lastName: {
            type: String,
            lowercase: true,
            trim: true
        },

        userName: {
            type: String,
            required: true,
            lowercase: true,
            unique: true,
            index: true,
            trim: true,
            match: /^[a-zA-Z0-9_.@-]+$/
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
            lowercase: true,
            validate:{
                validator: (value) => validator.isEmail(value),
                message: "Please enter a valid email"
            }

        },

        mobileNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true,
            validate:{
                validator: (value) => {
                    // Add more specific validation
                    return validator.isMobilePhone(value, 'any', { strictMode: false })
                },
                message: "Please enter a valid mobile number" 
            }
        },

        avatar:{
            type: String,
            // required: true
        },

        isEmailVerified: {
            type: Boolean,
            default: false
        },

        isMobileNumberVerified: {
            type: Boolean,
            default: false
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            validate: {
                validator: function(value) {
                // Password must contain at least one lowercase, uppercase, number and special character
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value);
                },
                message: "Password must contain at least one lowercase letter, uppercase letter, number and special character"
            },
        },

        role: {
            type: String,
            enum: [
                "user",          // consumer (default)
                "rideProvider",    // offers rides (driver)
                "rentalProvider",  // offers vehicles for rent
                // "companion",      trip/tour companion
                // "guide",           local tour guide
            ],
            default: "user",
        },

        refreshToken: {
            type: String,
        }

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


// this is pre hook in the model middleware to save the encrypt password 

userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()
    
    this.password = await bcrypt.hash(this.password,10)
    next()

})


//  make the custom method to check the password is correct or not it return the True/False

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

// make the custom method for the get the ACCESS TOKEN

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            email : this.email,
            userName : this.userName,
            mobileNumber: this.mobileNumber,
            role: this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


// make the custom method for the get the refresh token

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User",userSchema)
