import express, { Request, Response } from "express";
import { login, patientRegister } from "../controller/userController";
const router=express.Router();

router.post("/register",(req:Request,res:Response)=>{
    patientRegister(req,res);
})
router.post("/login",(req:Request,res:Response)=>{
    login(req,res);
})
export default router;