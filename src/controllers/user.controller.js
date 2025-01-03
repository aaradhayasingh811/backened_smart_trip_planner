import { User } from "../models/user.model.js";

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        console.log("Something went wrong while generating referesh and access token")
    }
}

const signupController = async(req,res)=>{
    try {
        const {name,email,password,username} = req.body;
        if(!name || !email || !password || !username){
            return res.status(400).json({message:"Please fill all the fields"});
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already exists"});
        }
        const user = new User({name,email,password,username});
        await user.save();
        const createdUser = await User.findById(user._id).select("-password");
        return res.status(201).json({ createdUser, message: "User created successfully" });
        
    } catch (error) {
        console.error(error,"signup controller not working")
    }
}

const loginController = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if( !email || !password ){
            return res.status(400).json({message:"Please fill all the fields"});
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const isValidPassword = await user.isPasswordCorrect(password);
        if(!isValidPassword){
            return res.status(400).json({message:"Invalid email or password"});
        }
        const accessToken =await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        user.refreshToken = refreshToken
        const options = {
            httpOnly: true,
            secure: true
        }
        // const isProduction = process.env.NODE_ENV === 'production';
        // const options = {
        //     httpOnly: true,
        //     secure: isProduction, // Secure in production only
        //     sameSite: 'Strict', // Prevent CSRF
        // };
        await user.save({ validateBeforeSave: false });
        const loggedinUser = await User.findById(user._id).select("-password -accesstoken");
        return res.status(200).cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options).json({accessToken, refreshToken,loggedinUser});

    } catch (error) {
        console.error(error,"Sign in controller not working")
    }
}

const logoutController = async(req, res) => {
    const {email} = req.params;
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"Invalid email"});
    }


    try {
        await User.findByIdAndUpdate(
            {_id :user._id},
            {
                $unset: {
                    refreshToken: 1 // this removes the field from document
                }
            },
            {
                new: true
            }
        )
    
        const options = {
            httpOnly: true,
            secure: true
        }
        // const options = {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production', // Secure only in production
        //     sameSite: 'Strict'
        // };
    
        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({message:"User logged Out"})
        
    } catch (error) {
        console.log(error);
    }
}


export  {signupController,loginController,logoutController}