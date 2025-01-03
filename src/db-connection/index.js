import mongoose from 'mongoose';
import {DB_NAME} from '../constants.js'

export const connection = async()=>{
    try{
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`).then(()=>{
            console.log('Connected to MongoDB');
        })
        .catch((err)=>{
            console.log('Error connecting to MongoDB:', err);
        })
    }
    catch(err){
        console.log("cant connect");
    }
}

