import { Document } from "mongoose";

export interface IUser extends Document {
  Name: string;
  Email: string;
  Password: string;
  PhoneNumber: string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

export interface IError {
  message: string;
}
