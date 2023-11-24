// require("dotenv").config({path: "./env"}); 
import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
dotenv.config({
    path: "./env"
})
// using singe file

import connectDB from './db/db.js';

const app = express();

// (async ()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error",(error) => {
//             console.error("ERROR: ",error);
//             throw error;
//         })
//         app.listen(process.env.PORT,`app is listening to ${process.env.PORT}`);
//     }catch{
//         console.error("ERROR: ", error);
//         throw err;
//     }
// })()
connectDB()
.then(() =>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO db connection failed !!! ", err);
})