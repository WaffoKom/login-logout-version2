import express from "express";
import {
  createResetSession,
  generateOTP,
  getUser,
  login,
  register,
  resetPassword,
  updateUser,
  verifyUser,
  verifyOTP,
} from "../controllers/user.controller.js";
import Auth, { localVariables } from "../midllware/auth.js";
import { registerMail } from "../controllers/mails.js";

const router = express.Router();

router.post("/register", register);
router.post("/registerMail", registerMail);
router.post("/authentificate", verifyUser, (req, res) => res.end());
router.post("/login", verifyUser, login);

router.get("/user/:username", getUser);
router.get("/generateOTP", verifyUser, localVariables, generateOTP);
router.get("/verifyOTP", verifyUser, verifyOTP);
router.get("/createResetSession", createResetSession);

router.put("/updateUser", Auth, updateUser);
router.put("/resetpassword", verifyUser, resetPassword);

export { router as userAuthRoute };
