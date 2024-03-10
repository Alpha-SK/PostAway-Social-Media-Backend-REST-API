import mongoose from "mongoose";
import { otpSchema } from "./otp.schema.js";

const OtpModel = mongoose.model("OTP", otpSchema);

export default class OtpRepository {
  async sendOTP(email, otp) {
    try {
      const newOTP = new OtpModel({ email: email, otp: otp });
      console.log(newOTP);
      await newOTP.save();
    } catch (error) {
      console.error(error);
      throw new ApplicationError(
        "Something went wrong with database while sending OTP...",
        500
      );
    }
  }

  async verifyOTP(email, otp) {
    try {
      const existingOTP = await findOneAndDelete({ email, otp });

      if (!existingOTP) {
        return false;
      }

      return existingOTP;
    } catch (error) {
      console.error(error);
      throw new ApplicationError(
        "Something went wrong with database while verifing OTP...",
        500
      );
    }
  }
}
