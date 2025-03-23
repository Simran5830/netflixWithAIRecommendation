import { User } from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import axios from 'axios'; // Used to make HTTP requests to the Flask server

const FLASK_BASE_URL = "http://localhost:5000"; // Flask server address (local development)

export async function searchMovies(req, res) {
    try {
        const { movieName } = req.body;

        if (!movieName) {
            return res.status(400).json({ success: false, message: "Movie name is required" });
        }

        // Send movie name to Flask API to get recommendations
        const response = await axios.post(`${FLASK_BASE_URL}/recommend`, { movie_val: movieName }).catch(error => {
            console.error("Error contacting Flask API:", error.message);
            return null;
        });
        
        if (!response || response.status !== 200) {
            return res.status(500).json({ success: false, message: "Failed to fetch recommendations from Flask API" });
        }

        if (response.status === 200) {
            return res.status(200).json({
                success: true,
                recommendations: response.data.result,
                posters: response.data.poster_url
            });
        }
        return res.status(500).json({ success: false, message: "Error fetching recommendations from Flask" });

    } catch (error) {
        console.error("Error in searchMovies:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
export async function signup(req,res){
    try{

        // const testUser = new User({
        //     email: "test@example.com",
        //     username: "testuser",
        //     password: "password123",
        //     image: "./avatar1.png"
        // });
        
        // await testUser.save();  // This forces MongoDB to create the database
        // console.log("Test user added!");

    const {email, username,password}=req.body;
    if(!email || !password || !username){
        return res.status(400).json(   //for validation 400 used
            {success:false, message:"all field required"})
    }
    const emailRegex= /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,}$/gm;
    if(!emailRegex.test(email)){
        return res.status(400).json({success:false, message:"email invalid"})
    }
    if(password.length<6){
        return res.status(400).json({success:false, message:"password should be greater than 6"})
    }
    const existingUserByEmail=await User.findOne({email:email}) 
    if(existingUserByEmail){
        return res.status(400).json({success:false, message:"email already exists"})
    }
    const existingUsername= await User.findOne({username:username})
    if(existingUsername){
        return res.status(400).json({status:false, message:"username exists"});
    }
    const PROFILE_PICS= ['./avatar1.png', './avatar2.png','./avatar3.png'];
    const image=PROFILE_PICS[Math.floor(Math.random()*PROFILE_PICS.length)];
    //bcrypt salt 
    const salt= await bcryptjs.genSalt(10);
    const hashedPassword= await bcryptjs.hash(password, salt);

    const newUser= new User({
        email,
        password:hashedPassword,
        username,
        image
    })

    generateTokenAndSetCookie(newUser._id,res);
    await newUser.save();
    res.status(201).json({success:true, user:{
        ...newUser._doc,   //spreads only actual data not metadata
        password:""
    }});

}
    catch(error){
    console.log('error in signup controller', error.message)
res.status(500).json({success:false, message:"internal error"
});
    }
    // res.send("signup");
}
export async function login(req,res){
  try{
    const {email,password}=req.body;
   if(!email || !password){
    return res.status(400).json({success:false, message:"all fields are required"}) //400 bad req, 404 not found
   }
   const user=await User.findOne({email:email})
   if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }
   const isPasswordCorrect= await bcryptjs.compare(password,user.password);
   if(!isPasswordCorrect){
    return res.status(400).json({success:false, message:"invalid cred"})
   }
   generateTokenAndSetCookie(user._id,res);
   return res.status(200).json({ success:true, 
    user:{
        ...user._doc,   //spreads only actual data not metadata
        password:""
   }})
}catch(error){
    console.log(error.message);
    res.status(500).json({success:false, message:"internal server error"});
}
}

export async function logout(req,res){
    try{
res.clearCookie('jwt-netflix');
res.status(200).json({success:true, message:"logged out successful"});
    }
    catch(error){
console.log("error in logot",error.message);
res.status(500).json({success:false,message:"internal server error"});
    }
}