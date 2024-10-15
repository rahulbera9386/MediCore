import { Request, Response } from "express";
import Message from "../models/messageSchema";

const sendMesage = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;
    if (!firstName || !lastName || !email || !phone || !message) {
      res
        .status(400)
        .json({ success: false, message: "Please Fill all the fields" });
    }
    const newMessage = await Message.create({
      firstName,
      lastName,
      phone,
      email,
      message,
    });
    const savedMessage = await newMessage.save();
    return res
      .status(200)
      .json({ message: "Message send successfully", data: savedMessage });
  } catch (error: any) {
    //console.log(error);
    //console.log(error.name)
    if (error.name === "ValidationError") {
      const errors = error.errors
        ? Object.values(error.errors)
            .map((err: any) => err.message)
            .join(",")
        : error.message;
      console.log(errors);

      return res.status(400).json({ succes: false, err: errors });
    }
    return res.status(500).json({ message: "Server Error" });
  }
};

export default sendMesage;
