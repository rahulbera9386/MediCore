import mongoose from "mongoose";

const dbConnection=async()=>{
    const mongoUri=process.env.MONGO_URI;
    if(!mongoUri)
    {
        throw new Error("Mongo Uri is not defined");
    }
    await mongoose.connect(mongoUri);
    console.log("Database Connected")
    try{

    }
    catch(e){
console.log(e)
    }
}

export default dbConnection;