import mongoose from "mongoose";
import validator from "validator";




const messageSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:[3,"First Name should be atleast 3 Charecters"]

    },
    lastName:{
        type:String,
        required:true,
        minLength:[3,"First Name should be atleast 3 Charecters"]
    },
    phone:{
        type:String,
        required:true,
        validate:[validator.isMobilePhone,"Provide a valid phone number"]
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail,"Provide a valid Email"]
    },
    message: {
        type: String,
        required: true,
        minLength: [10, "Message Must Contain At Least 10 Characters!"],
      }
});

const Message=mongoose.model("Message",messageSchema);

export default Message;