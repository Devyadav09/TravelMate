import { asyncHandler } from "../../utils/asyncHandler.js"
import {ApiError} from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import {loginUserService, logoutUserService, deleteUserService} from "../../services/v1/auth.service.js"


const login = asyncHandler(async(req,res)=>{

    const {email, userName, password} = req.body

    if([email, userName, password].some(field => !field)){
        throw new ApiError(400, "email, username and password is required")
    }

    const { user, refreshToken, accessToken } = await loginUserService({email, userName, password})
    

    if(!user) throw new ApiError(500, "Internal Server Error Please Try Again")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,
            {
                user, accessToken, refreshToken
            },
            "User login successfully"
        )
    )
    
})


const logout = asyncHandler(async(req,res)=>{

    await logoutUserService(req.user._id)
    const options = {
      httpOnly: true,
      secure: true
    };

    // Clear cookies and send response
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged Out"));

})


const deleteUser = asyncHandler(async (req, res) => {
  try {
    
    const result = await deleteUserService({ _id: req.user._id });
    
    // Clear cookies if deleting own account
    const options = {
      httpOnly: true,
      secure: true
    };
    
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, result, "User deleted successfully"));
      
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to delete user");
  }
});


export{
    login,
    logout,
    deleteUser
}