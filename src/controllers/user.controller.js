import {asyncHandler} from "../utils/asyncHandler.js";
import {apiErrors} from "../utils/apierror.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary"
import {ApiResponse} from "../utils/apiresponse.js"

const registerUser = asyncHandler( async(req,res) =>{
    //get user details from frontend


    //validation - not empty
    const {fullName,email,username,password} = res.body;
    console.log("fullname:", fullName, "email: ",email)

    //check if user already exists : email,username

    if([fullName,email,username,password].some((fields) => fields?.trim() === "")){
        throw new apiErrors(400,"all fields required");
    }

    //check for images , avatar
    const userExist = await user.findOne({
        $or: [{email},{username}]
    })

    if(userExist){
        throw new apiErrors(409,"user existed with this email or password")
    }
    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log("req.files:",req.files)

    const coverLocalPath = req.files?.cover[0]?.path;

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

    const createdUser = user.findById(user.id).selec(
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