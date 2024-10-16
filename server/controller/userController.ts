import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import cloudinary from "../config/cloudinary";
import User from './../models/userSchema';
import getDataUri from "../config/dataUri";
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
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message).join(",");
      return res.status(400).json({ success: false, errors })
    }
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
};












const login = async (req: Request, res: Response) => {
  const { email, password, confirmPassword, role } = req.body;
  try {
    if (!email || !password || !confirmPassword || !role) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords and confirmpassword does not matching",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Does not exist",
      });
    }
    //const storedHash = user.password; 

    if (!user.password) {
      return res.status(500).json({
        success: false,
        message: "User password not found, please check your user data.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }
    if (role != user.role) {
      return res.status(400).json({
        success: false,
        message: "User with this role does not exist",
      });
    }

    const tokenData = {
      id: user._id,
      email: user.email,

    }
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    if (!jwtSecretKey) {
      throw new Error("JWT Secret key is not defined");
    }
    const token = jwt.sign(tokenData, jwtSecretKey, { expiresIn: "1h" })
    return res.cookie(user.role === "Patient" ? "patientToken" : "adminToken", token, { httpOnly: true, secure: false }).status(200).json({ success: true, message: `Welcome To MediCore ${user.firstName}`, user: { firstName: user.firstName, email: user.email } });
  }
  catch (error: any) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message).join(",");
      return res.status(400).json({ success: false, errors })
    }
    console.log(error)
    //return res.status(500).json({ success: false, message: "Internal server error" })
  }

}







const addNewAdmin = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, dob, gender, role } = req.body;
  try {
    if (!firstName || !lastName || !email || !password || !dob || !gender) {
      return res.status(400).json({
        success: false,
        message: "Please fill full form"
      })
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return res.status(400).json({ success: false, message: `${isRegistered.role} is already registered` })
    }

    const newAdmin = await User.create({
      firstName, lastName, email, password, dob, gender, role: "Admin"
    })
    return res.status(200).json({ success: true, message: "Admin created success" })


  }
  catch (error: any) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message).join(",");
      return res.status(400).json({ success: false, errors })
    }
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}






const getAllDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await User.find({ role: "Doctor" });
    res.status(200).json({
      success: true,
      doctors,
    });
  }
  catch (error: any) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message).join(",");
      return res.status(400).json({ success: false, errors })
    }
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}


const addNewDoctor = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, dob, gender, password, doctorDepartment } = req.body;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !dob ||
      !gender ||
      !password ||
      !doctorDepartment
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill out all required fields!",
      });
    }
    //   console.log(req.body);
    // console.log(req.file);  


    const docAvatar = req.file as Express.Multer.File;
    const fileUri = getDataUri(docAvatar);
    if (!fileUri || !fileUri.content) {
      return res.status(400).json({
        success: false,
        message: "File URI is required!",
      });
    }

    if (!docAvatar) {
      return res.status(400).json({
        success: false,
        message: "Doctor Avatar is required!",
      });
    }
    const allowedFormats = ["image/png", "image/jpg", "image/webp"]
    if (!allowedFormats.includes(docAvatar.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported file format! Use PNG, JPEG, or WEBP.",
      });
    }
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
      return res.status(400).json({
        success: false,
        message: "A doctor with this email already exists!",
      });
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(fileUri.content);
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      return res.status(500).json({
        success: false,
        message: "Failed to upload doctor avatar to Cloudinary",
      });
    }
    const doctor = await User.create({
      firstName,
      lastName,
      email,
      phone,
      dob,
      gender,
      password,
      role: "Doctor",
      doctorDepartment,
      docAvatar: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });
    return res.status(201).json({
      success: true,
      message: "New Doctor registered successfully",
      doctor,
    });

  }
  catch (error: any) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message).join(",");
      return res.status(400).json({ success: false, errors })
    }
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}







const getUserDetails = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    res.status(200).json({
      success: true,
      user,
    });
  }
  catch (error: any) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message).join(",");
      return res.status(400).json({ success: false, errors })
    }
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}





const logoutAdmin = async (req: Request, res: Response) => {
  try {
    res.status(201).cookie("adminToken", "", { httpOnly: true, expires: new Date(Date.now()) }).json({
      success: true, message: "Admin Logged Out Successfully.",
    })
  }
  catch (error: any) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message).join(",");
      return res.status(400).json({ success: false, errors })
    }
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}






const logoutPatient = async (req: Request, res: Response) => {
  try {

    res.status(201).cookie("patientToken", "", { httpOnly: true, expires: new Date(Date.now()) }).json({
      success: true, message: "Patient Logged Out Successfully.",
    })
  }
  catch (error: any) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message).join(",");
      return res.status(400).json({ success: false, errors })
    }
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}





export { patientRegister, login, addNewAdmin, addNewDoctor, getAllDoctors, getUserDetails, logoutPatient, logoutAdmin };
