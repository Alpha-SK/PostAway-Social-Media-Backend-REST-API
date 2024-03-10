import { Schema } from "mongoose";

export const otpSchema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
});
