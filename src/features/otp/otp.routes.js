import express from "express";
import OtpController from "./otp.controller.js";

const otpRoutes = express.Router();
const otpController = new OtpController();

// routes for like api
// Retrieve all likes for specific post
otpRoutes.post("/send", (req, res) => {
  otpController.sendOTP(req, res);
});

// toogle like status for specific post
otpRoutes.get("/verify", (req, res) => {
  otpController.verifyOTP(req, res);
});

export default otpRoutes;
