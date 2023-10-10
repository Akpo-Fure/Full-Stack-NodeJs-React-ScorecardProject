import { Response, Request, NextFunction } from "express";
import User from "../models/userModel";

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
    if (user) return res.status(400).json("User already exists");
    const createdUser = await User.create(req.body);
    if (createdUser) return res.status(201).json("User created succesffuly");
  } catch (error: any) {
    return res.status(500).json({ Error: error.message });
  }
};
