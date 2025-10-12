import { asyncHandler } from "../../../../utils/asyncHandler.js"
import {ApiError} from "../../../../utils/ApiError.js"
import { ApiResponse } from "../../../../utils/ApiResponse.js"
import {changeDriverRoleToUserService,
    updateVehicleDetailsService
} from "../../../driver/services/v1/driver.service.js"


const changeDriverRoleToUser = asyncHandler(async(req,res)=>{

    const { userId } = req.params;
    const {role} = req.body

    if (!userId) {
        throw new ApiError(400, "UserId is required");
    }

    if (!role) {
        throw new ApiError(400, "Role is required");
    }
    
    const changeDrivrRole = await changeDriverRoleToUserService({userId, role})
    
    if(!changeDrivrRole) throw new ApiError(500, "Internal Server Error")

    return res
    .status(200)
    .json(new ApiResponse(200, changeDrivrRole, "Drive role change to user successfully"))

})


const updateVehicleDetails = asyncHandler(async(req,res)=>{

    const { _id } = req.params
    const { vehicleDetails } = req.body 

    if (!_id) throw new ApiError(400, "Driver Id is required")
    
    if (!vehicleDetails) throw new ApiError(400, "Vehicle details is required")

    const role = req.user.role

    if (! role.toLowerCase() == "driver") throw new ApiError(401, "Unauthorized: No user found")

    const updateVehicleDetails = await updateVehicleDetailsService({_id, vehicleDetails})

    return res
    .status(200)
    .json(new ApiResponse(200, updateVehicleDetails, "Vehicle details updated successfully"))
})


export {
    changeDriverRoleToUser,
    updateVehicleDetails
}