import jwt from "jsonwebtoken"
import { ENV_VARS } from "../config/envVars.js"

export const generateTokenAndSetCookie=(userId, res)=>{
    const token=jwt.sign({userId}, ENV_VARS.JWT_SECRET,{expiresIn:"15d"});

    res.cookie("jwt-netflix",token, {
        maxAge: 15*24*60*60*1000,
        httpOnly:true, //prevent attachs, not accessible by JS
        sameSite:"strict",
        secure:ENV_VARS.NODE_ENV!=="development"
         
   });
   return token;
};