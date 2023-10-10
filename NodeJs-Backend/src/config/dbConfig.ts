import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB connected: ${connection.connection.host} `);
  } catch (error) {
    console.log(`Error connecting to the database ${error}`);
  }
};

export default connectDB;
