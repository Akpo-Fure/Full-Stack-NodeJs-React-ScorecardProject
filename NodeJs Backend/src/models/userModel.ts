import mongoose, { Model, Document, Schema } from "mongoose";
import joi from "joi";
import bcrypt from "bcrypt";
import { IUser } from "../interfaces/interfaces";

const UserValidationSchema = joi.object({
  Name: joi
    .string()
    .required()
    .custom((value, helpers) => {
      const names = value.trim().split(" ");

      if (names.length < 2) {
        return helpers.error("Name must not be less than two names");
      }

      return value;
    }),
  Email: joi.string().email().required(),
  Password: joi.string().min(6).required().trim(),
  PhoneNumber: joi
    .string()
    .required()
    .pattern(/^(081|080|070|090)\d{8}$/)
    .trim(),
});

const UserSchema = new Schema<IUser>(
  {
    Name: { type: String, required: true, trim: true },
    Email: { type: String, required: true, unique: true, trim: true },
    Password: { type: String, required: true, trim: true },
    PhoneNumber: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: true }
);

UserSchema.methods.matchPassword = async function matchPassword(
  enteredPassword: string
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.Password);
};

UserSchema.pre<IUser>("save", async function hashPassword(next) {
  if (!this.isModified("Password")) {
    next();
  }
  try {
    this.Password = await bcrypt.hash(
      this.Password,
      Number(process.env.SALT_ROUNDS!)
    );
    next();
  } catch (error: any) {
    next(error);
  }
});

UserSchema.pre<IUser>("validate", async function validate(next) {
  try {
    const { Name, Email, Password, PhoneNumber } = this;
    const validateUser = await UserValidationSchema.validateAsync(
      { Name, Email, Password, PhoneNumber },
      { abortEarly: false }
    );
    this.set(validateUser);
    next();
  } catch (error: any) {
    next(error);
  }
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;
