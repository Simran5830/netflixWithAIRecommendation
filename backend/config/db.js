 import mongoose from "mongoose";
import { ENV_VARS } from "./envVars.js";

export const connectDB= async()=>{
    try {
        if (!ENV_VARS.MONGO_URI) {
          throw new Error("MONGO_URI is not defined in envVars.js");
        }
    
        const conn = await mongoose.connect(ENV_VARS.MONGO_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
    
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
      }
    };