import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxLength: [25, "Name can't be greater than 25 character"],
  },
  email: {
    type: String,
    unique: true,
    required: true,
    match: [/.+\@.+\../, "Please enter a valid email"],
  },
  password: {
    type: String,
    // validate: {
    //   validator: function (value) {
    //     return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/.test(value);
    //   },
    //   message:
    //     "Password shoud be between 8-15 charcters and have a special character",
    // },
  },
})
