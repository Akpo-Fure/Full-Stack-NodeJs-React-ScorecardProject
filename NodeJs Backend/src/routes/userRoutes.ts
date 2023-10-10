import express from "express";
import {
  signup,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/userController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.patch("/verifyemail/:token", verifyEmail);
router.patch("/resetpassword/:token", resetPassword);

export default router;
