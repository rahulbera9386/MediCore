import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import bodyParser from "body-parser";
import dbConnection from "./database/dbConnection";
import sendMessageRouter from "./routes/sendMessage"





const app=express();
dotenv.config({path:"./.env"})




//Miiddlewares
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
const corsOption={
    origin:[process.env.FRONTEND_URL_ONE,process.env.FRONTEND_URL__TWO].filter(url => url !== undefined),
    method:["POST","GET","PUT","DELETE"],
    credentials:true
}
app.use(cors(corsOption));
app.use(bodyParser.json());

app.use("/api/v1/message",sendMessageRouter)




app.listen(process.env.PORT,()=>{
    console.log(`Server is running on:${process.env.PORT}`)
    dbConnection();
})