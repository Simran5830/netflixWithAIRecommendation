import dotenv from 'dotenv';
import path from "path"; // Ensure correct file path

dotenv.config(); // Auto-loads .env from the root directory

console.log("MONGO_URI from process.env:", process.env.MONGO_URI);


// Debug: Print ENV_VARS to check if MONGO_URI is loaded

export const ENV_VARS={
    MONGO_URI: process.env.MONGO_URI,
    PORT:process.env.PORT || 5000,
    JWT_SECRET:process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    TMDB_API_KEY:process.env.TMDB_API_KEY,
};


console.log("ENV_VARS:", ENV_VARS);
