import jwt from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (id: string) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

export const setTokenCookie = (res: Response, token: string) => {
  res.setHeader(
    "Set-Cookie",
    `jwt=${token}; HttpOnly; Max-Age=${process.env.JWT_COOKIE_EXPIRES_IN}`
  );
};
