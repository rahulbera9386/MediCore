import { NextFunction, Request, Response } from "express";
import  jwt  from 'jsonwebtoken';
import User from "../models/userSchema";






declare global {
    namespace Express {
        interface Request {
            user?: any; 
        }
    }
}
const isAdminAuthenticated=async(req:Request,res:Response,next:NextFunction)=>{
    try{
const token=req.cookies.adminToken;
if(!token)
{
    return res.status(400).json({success:false,message:" Admin User is not authenticated"})
}
const secretKey = process.env.JWT_SECRET_KEY;
if (!secretKey) {
    return res.status(500).json({ success: false, message: "JWT secret key is not defined" });
}
const decoded= jwt.verify(token, secretKey) as jwt.JwtPayload;
req.user=await User.findById(decoded.id);
if(req.user.role!=="Admin")
{
    return res.status(403).json({success:false,message:`${req.user.role} not authorized for this resource!`})
}
next()
    }
    catch(err)
    {
        console.log(err);
    }
}
const isPatientAuthenticated=async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const token=req.cookies.patientToken;
        if(!token)
        {
            return res.status(400).json({success:false,message:"User is not authenticated"})
        }
        const secretKey = process.env.JWT_SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({ success: false, message: "JWT secret key is not defined" });
        }
        const decoded= jwt.verify(token, secretKey) as jwt.JwtPayload;
        req.user=await User.findById(decoded.id);
        if(req.user.role!=="Patient")
        {
            return res.status(403).json({success:false,message:`${req.user.role} not authorized for this resource!`})
        }
        next()
    }
    catch(err)
    {
        console.log(err);
    }
}



export {isAdminAuthenticated,isPatientAuthenticated};