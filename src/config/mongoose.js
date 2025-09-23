import mongoose from "mongoose";
import dotenv from "dotenv";

// dotenv.config();
const url = "mongodb://localhost:27017/appointment";
export const connectUsingMongoose = async()=>{
    try{
        await mongoose.connect(url);
        console.log("Mongodb connected using mongoose");
    }catch(err){
        console.log("Error while connecting to db");
        console.log(err);
    }
}

