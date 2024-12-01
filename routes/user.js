import express from "express";
import { loginuser, registeruser } from "../controller/userController.js";

export const userRoute = express.Router();

userRoute.post("/register", registeruser);
userRoute.post("/login", loginuser)