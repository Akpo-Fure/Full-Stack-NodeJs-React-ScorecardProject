import express from "express";
import { signup, login, verifyEmail } from "../controllers/userController";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch("/verifyEmail/:token", verifyEmail);

export default router;
