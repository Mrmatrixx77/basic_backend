import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(filepath) =>{
        try{
            if(!filepath) return null;
            const response = await cloudinary.v2.uploader.upload(filepath,{resourse_type : "auto"});
            console.log("file uploaded", response);
            return response;
        }catch(error){
            fs.unlinkSync(filepath);
            return null;
        }
}
export {uploadOnCloudinary}

// cloudinary.v2.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" }, 
//   function(error, result) {console.log(result); });