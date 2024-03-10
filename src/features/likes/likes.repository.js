import mongoose from "mongoose";
import { ApplicationError } from "../../error/applicationError.js";
import { likeSchema } from "./likes.schema.js";
import { ObjectId } from "mongodb";
import { PostModel } from "../posts/post.repository.js";
import { UserModel } from "../user/user.repository.js";

const LikeModel = mongoose.model("Like", likeSchema);

export class LikeRepository {
  async getAllLikes(postId) {
    try {
      const allLikes = await LikeModel.find({ post: postId });
      return allLikes;
    } catch (error) {
      console.error(error);
      throw new ApplicationError(
        "Something went wrong with database while getting all likes...",
        500
      );
    }
  }

  async toogleLikes(postId, userId, liked) {
    try {
      const postCheck = await PostModel.findById(postId);
      if (!postCheck) {
        return false;
      }

      let like = await LikeModel.findOne({
        user: await UserModel.findById(userId),
        post: await PostModel.findById(postId),
      });

      if (!like) {
        const newLike = new LikeModel({
          user: await UserModel.findById(userId),
          post: await PostModel.findById(postId),
          liked: liked,
          // user: new ObjectId(userId),
          // post: new ObjectId(postId),
          // liked: liked,
        });

        await newLike.save();
        return newLike;
      }

      if (like.liked) {
        like = await LikeModel.findOneAndUpdate(
          { post: postId, user: userId },
          { liked: false },
          { new: true }
        );
      } else {
        like = await LikeModel.findOneAndUpdate(
          { post: postId, user: userId },
          { liked: true },
          { new: true }
        );
      }

      return like;

      // if (like.liked) {
      //   like = await LikeModel.findOneAndUpdate(
      //     { post: postId, user: userId },
      //     { liked: false },
      //     { new: true }
      //   );
      // } else {
      //   like = await LikeModel.findOneAndUpdate(
      //     { post: postId, user: userId },
      //     { liked: true },
      //     { new: true }
      //   );
      // }
      // return like;
    } catch (error) {
      console.error(error);
    }
  }
}
