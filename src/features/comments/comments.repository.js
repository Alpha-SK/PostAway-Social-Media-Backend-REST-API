import mongoose from "mongoose";
import { commentSchema } from "./comments.schema.js";
import { PostModel } from "../posts/post.repository.js";
import { ApplicationError } from "../../error/applicationError.js";
import { ObjectId } from "mongodb";

const CommentModel = new mongoose.model("Comment", commentSchema);

export class CommentRepository {
  async newComment(userId, postId, content) {
    try {
      const postCheck = await PostModel.findById(postId);
      console.log(postCheck);
      if (!postCheck) {
        return false;
      }

      const newComment = new CommentModel({
        user: new ObjectId(userId),
        post: new ObjectId(postId),
        content: content,
      });
      return await newComment.save();
    } catch (error) {
      console.error(error);
      throw new ApplicationError(
        "Something went wrong with database while adding comment...",
        500
      );
    }

    // const post = PostModel.getAll().find((p) => p.id == comment.postId);

    // if (!post) {
    //   throw new ApplicationError("Post not found...", 404);
    // }

    // comment.id = allComments.length + 1;
    // allComments.push(comment);

    // return comment;
  }

  async getAllComments(postId) {
    try {
      const allComments = await CommentModel.find({ post: postId });
      return allComments;
    } catch (error) {
      console.error(error);
      throw new ApplicationError(
        "Something went wrong with database while getting comment...",
        500
      );
    }

    //   const result = allComments.find((c) => c.postId == postId);
    //   const comments = allComments.filter((c) => c.postId == postId);

    //   if (!result) {
    //     throw new ApplicationError("Comment not found...", 404);
    //   }

    //   return comments;
  }

  async delete(postId, userId, commentId) {
    try {
      const deleteComment = await CommentModel.findByIdAndDelete(
        { _id: commentId },
        {
          post: postId,
          user: userId,
        }
      );

      return deleteComment;
    } catch (error) {
      console.error(error);
      throw new ApplicationError(
        "Something went wrong with database while deleting comment...",
        500
      );
    }

    // const commentIndex = allComments.findIndex(
    //   (i) => i.postId == postId && i.userId == userId && i.id == commentId
    // );

    // if (commentIndex == -1) {
    //   throw new ApplicationError("Comment not found...", 404);
    // } else {
    //   return allComments.splice(commentIndex, 1);
    // }
  }

  async updateCommentById(postId, commentId, updatedData) {
    try {
      const updateComment = await CommentModel.findByIdAndUpdate(
        { _id: commentId, post: postId },
        updatedData,
        { new: true }
      );

      return updateComment;
    } catch (error) {
      console.error(error);
      throw new ApplicationError(
        "Something went wrong with database while updating comment...",
        500
      );
    }

    // const commentIndex = allComments.findIndex(
    //   (i) => i.id == commentId && i.postId == postId
    // );

    // if (commentIndex == -1) {
    //   throw new ApplicationError("Comment not found...", 404);
    // } else {
    //   allComments[commentIndex] = {
    //     ...allComments[commentIndex],
    //     ...updatedData,
    //   };
    //   return allComments[commentIndex];
    // }
  }
}
