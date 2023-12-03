// require("dotenv").config({path: "./env"}); 
import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
// import connectDB from "./db/db.js";
import { app } from "./app.js";
dotenv.config({
    path: "./.env"
})
// using singe file

import connectDB from './db/db.js';

connectDB()
.then(() =>{
    app.listen(8000, ()=>{
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO db connection failed !!! ", err);
})