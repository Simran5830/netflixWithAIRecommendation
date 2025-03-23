// const express= require('express');
import express from 'express';
import authRoutes from "./routes/auth.route.js"
import movieRoutes from "./routes/movie.route.js"
import tvRoutes from "./routes/tv.route.js"
import searchRoutes from "./routes/search.route.js";

import dotenv from "dotenv";
import { ENV_VARS } from './config/envVars.js';
import { connectDB } from './config/db.js';
import cookieParser from 'cookie-parser';
import path from 'path';

import { protectRoute } from "./middleware/protectRoute.js";
dotenv.config();
const app=express();
const PORT= ENV_VARS.PORT
const __dirname = path.resolve();
app.use(express.json()); //will allow to use req.body
app.use(cookieParser());

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/movie",protectRoute,movieRoutes);
app.use("/api/v1/tv",protectRoute,tvRoutes);
app.use("/api/v1/search",protectRoute,searchRoutes);
console.log("MongoURI:", process.env.MONGO_URI);
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});
app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`);  
    connectDB();  
});
