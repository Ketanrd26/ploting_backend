import {UserModel} from "../class/class.js";
import { login, register } from "../service/userService.js";
import bcrypt from "bcrypt"
export const registeruser = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(404).json({
        status: "error",
        message: "all feilds required",
      });
    }

    const user = new UserModel({username,password,role});
  

    const response = await register(user);
    if(response.success){
        res.status(201).json({
            message:"registerd successfully",
            data:response
        })
    }else{
        res.status(400).json({
            message:"something error"
        })
    }
  } catch (error) {
    res.status(500).json({
        error:error
    })
  }
};


// login

export const loginuser = async (req,res)=>{
try {
    const {username, password} = req.body;

    if(!username || !password){
        res.status(404).json({
            status:"error",
            message:"do not empty any feilds"
        })
    }

    const response = await login(username,password);
    if(response.success){
        res.status(201).json({
            response
        })
    }else{
        res.status(401).json({
            status:"error",
            message:"something error"
        })
    }
} catch (error) {
    res.status(500).json({
        status:"error",
        message:error
    })
}
}