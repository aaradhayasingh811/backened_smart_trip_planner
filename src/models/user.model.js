import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
    name : {
        type :String,
        required :true,
    },
    username :{
        type :String,
        required :true,
        unique : true,
    },
    email :{
        type :String,
        required :true,
        unique : true,
    },
    password :{
        type :String,
        required : [true, 'Password is required']
    },
    refreshToken :{
        type :String,
    },
    savedTrips:{
        type : mongoose.Schema.Types.ObjectId,
        ref :"Trip"
    }
}, {
    timestamps: true
})

// userSchema.pre("save", async function (next) {
//     if(!this.isModified("password")) return next();

//     this.password = await bcrypt.hash(this.password, 10)
//     next()
// })
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password, salt);
    next()
})
// userSchema.methods.isPasswordCorrect = async function(password){
//     return await bcrypt.compare(password, this.password)
// }

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compareSync(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)