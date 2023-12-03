import {asyncHandler} from "../utils/asyncHandler.js";
import {apiErrors} from "../utils/apierror.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/apiresponse.js"

const registerUser = asyncHandler( async(req,res) =>{
    //get user details from frontend


    //validation - not empty
    const {fullName,email,username,password} = req.body;
    console.log("fullname:", fullName, "email: ",email)

    //check if user already exists : email,username

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new apiErrors(400, "All fields are required")
    }

    //check for images , avatar
    const userExist = await User.findOne({
        $or: [{username},{email}]
    })

    if(userExist){
        throw new apiErrors(409,"user existed with this email or password")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log("req.files:",req.files)

    let coverLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new apiErrors(400,"avatar is required")
    }
    
    //upload them to cloudinary - avatar

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverLocalPath);

    if(!avatar){
        throw new apiErrors(409,"avatar is required")
    }

    
    //create entry in db
    const user = await User.create({
        fullName,
        avatar : avatar.url, 
        coverImage: coverImage?.url||"",
        email,
        password,
        username : username.toLowerCase() 
    })
    //remove password and refresh tokens from response

    // const createdUser = await user.findById(user.id).select(
    //     "-password -refreshToken"
    // )
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    //check user creation
        if(!createdUser){
            throw new apiErrors(500,"something went wrong while creating user")
        }

    //return user
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
    

})

export {registerUser}