import { Request, Response } from "express";
import User from "../models/userSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
const patientRegister = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, dob, gender, password } =
      req.body;
    if (!firstName) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Your First Name" });
    }
    if (!lastName) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Your Last Name" });
    }
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Your Email Id" });
    }
    if (!phone) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Your Phone Number" });
    }
    if (!dob) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Your Date Of Birth" });
    }
    if (!gender) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Your Gender" });
    }
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Please Enter Password" });
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return res
        .status(400)
        .json({ success: false, message: "You are already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      password: hashedPassword,
      role: "Patient",
    });
    return res
      .status(200)
      .json({ success: true, message: "Patient Registered Successful" });
  } catch (error:any) {
    if(error.name==="ValidationError")
    {
        const errors=Object.values(error.errors).map((err:any)=>err.message).join(",");
        return res.status(400).json({success:false,errors})
    }
    return res.status(500).json({success:false,message:"Internal server error"})
  }
};












const login = async (req: Request, res: Response) => {
  const { email, password, confirmPassword, role } = req.body;
  try{
    if (!email || !password || !confirmPassword || !role) {
        return res.status(400).json({
          success: false,
          message: "Please fill all the fields",
        });
      }
    
    if(password!==confirmPassword)
    {
        return res.status(400).json({
            success: false,
            message: "Passwords and confirmpassword does not matching",
          });
    }
    
    const user=await User.findOne({email});
    if(!user)
    {
        return res.status(400).json({
            success: false,
            message: "User Does not exist",
          });
    }
    const passwordMatch=bcrypt.compare(password,user.password);
    if(!passwordMatch)
    {
        return res.status(400).json({
            success: false,
            message: "Password is wrong",
          });
    }
    if(role!=user.role)
    {
        return res.status(400).json({
            success: false,
            message: "User with this role does not exist",
          });
    }
    
    const tokenData={
        id:user._id,
        email:user.email,
    
    }
    const jwtSecretKey=process.env.JWT_SECRET_KEY;
    if(!jwtSecretKey)
    {
        throw new Error("JWT Secret key is not defined");
    }
    const token=jwt.sign(tokenData,jwtSecretKey,{expiresIn:"1h"})
    return res.cookie(user.role==="Patient"?"patientToken":"adminToken",token,{httpOnly:true,secure:false}).status(200).json({success:true,message:`Welcome To MediCore ${user.firstName}`,user:{firstName:user.firstName,email:user.email}});
  }
  catch (error:any) {
    if(error.name==="ValidationError")
    {
        const errors=Object.values(error.errors).map((err:any)=>err.message).join(",");
        return res.status(400).json({success:false,errors})
    }
    return res.status(500).json({success:false,message:"Internal server error"})
  }
  
}

export { patientRegister, login };
