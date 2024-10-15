import express, { Request, Response } from "express";
import sendMesage from "../controller/messageController";

const router=express.Router();

router.post("/send",(req:Request,res:Response)=>{
    sendMesage(req,res);
})

export default router