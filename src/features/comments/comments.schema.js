import mongoose from "mongoose";

export const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Poat",
  },
  content: {
    type: String,
    required: true,
  },
});
