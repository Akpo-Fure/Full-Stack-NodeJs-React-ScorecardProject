import { Response, Request, NextFunction } from "express";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail";
import User from "../models/userModel";
import { clientUrl } from "../config/serverConfig";
import { generateToken, setTokenCookie } from "../utils/tokenGenerator";

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

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const HashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      VerifyEmailToken: HashedToken,
      VerifyEmailExpires: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({
        status: "error",
        message: "Token is invalid or has expired",
      });
    user.isVerified = true;
    user.VerifyEmailToken = undefined;
    user.VerifyEmailExpires = undefined;
    await user.save();
    return res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { Email, Password } = req.body;
    const user = await User.findOne({ Email: Email.toLowerCase() });
    if (!user) return res.status(400).json({ message: "invalid credentials" });
    if (user && !(await user.matchPassword(Password))) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    if (!user.isVerified) {
      await user.createVerifyEmailToken();
      await user.save({ validateBeforeSave: false });
      const verifyURl = `${clientUrl}/user/verifyEmail/${user.VerifyEmailToken}`;
      const message = `Hi, Welcome ${user.Name}, It is great to have you on board.\nVerify your email address by clicking on the link below: ${verifyURl}. \nIf you are having trouble verifying your email, please reply this email so we can help you out`;
      try {
        await sendEmail({
          email: user.Email,
          subject: "Hello, Please verify your email address",
          message,
        });
        return res.status(400).json({
          status: "success",
          message:
            "Email not verified, Token sent to email!, please check your email and verify",
        });
      } catch (error: any) {
        user.VerifyEmailToken = undefined;
        user.VerifyEmailExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({
          status: "error",
          message: "There was an error sending the email. Try again later",
        });
      }
    }
    const token = generateToken(user._id);
    setTokenCookie(res, token);
    return res
      .status(200)
      .json({ message: "User signed in successfully", token, user });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
