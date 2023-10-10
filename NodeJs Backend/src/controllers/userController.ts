import { Response, Request, NextFunction } from "express";
import sendEmail from "../utils/sendEmail";
import User from "../models/userModel";
import { clientUrl } from "../config/serverConfig";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { Name, Email, Password, PhoneNumber } = req.body;
    if (req.body.PhoneNumber.startsWith("+234")) {
      req.body.PhoneNumber = req.body.PhoneNumber.replace("+234", "0");
    }
    req.body.Email = req.body.Email.toLowerCase();
    const user = await User.findOne({ Email: req.body.Email });
    if (user) return res.status(400).json({ message: "User already exists" });
    const createdUser = await User.create(req.body);
    if (!createdUser)
      return res.status(400).json({ message: "Failed to create user" });
    const verifyEmail = createdUser.createVerifyEmailToken();
    await createdUser.save({ validateBeforeSave: false });
    const verifyURl = `${clientUrl}/user/verifyEmail/${verifyEmail}`;
    const message = `Hi, Welcome ${createdUser.Name}, It is great to have you on board.\nVerify your email address by clicking on the link below: ${verifyURl}. \nIf you didn't create an account, please ignore this email`;
    try {
      await sendEmail({
        email: createdUser.Email,
        subject: "Welcome, Please verify your email address",
        message,
      });
      return res.status(201).json({
        status: "success",
        message: "Token sent to email!, please check your email and verify",
      });
    } catch (error: any) {
      createdUser.VerifyEmailToken = undefined;
      createdUser.VerifyEmailExpires = undefined;
      await createdUser.save({ validateBeforeSave: false });
      return res.status(500).json({
        status: "error",
        message: "There was an error sending the email. Try again later",
      });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
