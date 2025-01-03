
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        // console.log(token);
        if (!token) {
            return res.status(400).json({message:"Invalid token"});

        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            return res.status(400).json({message:"Invalid token access"});

        }
    
        req.user = user;
        next()
    } catch (error) {
        console.log("Invalid token")
    }
    
}
