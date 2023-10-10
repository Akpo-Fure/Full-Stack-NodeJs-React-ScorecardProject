import dotenv from "dotenv";
dotenv.config();

const config = {
  production: {
    apiURL: "https://akpofure-scorecard.onrender.com",
    clientURL: "akpofures-scoreboard.vercel.app",
  },
  development: {
    apiURL: "http://localhost:3000",
    clientURL: "http://localhost:5173",
  },
};

const isProduction = process.env.NODE_ENV === "production";

export const apiUrl = isProduction
  ? config.production.apiURL
  : config.development.apiURL;

export const clientUrl = isProduction
  ? config.production.clientURL
  : config.development.clientURL;
