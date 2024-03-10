import mongoose from "mongoose";
import { postSchema } from "./post.schema.js";
import { ApplicationError } from "../../error/applicationError.js";
import { ObjectId } from "mongodb";

export const PostModel = mongoose.model("Post", postSchema);

export default class PostRepository {

  async getAll() {
    try {
      const allPosts = await PostModel.find();
      return allPosts;
    } catch (error) {
      console.error(error);
      throw new ApplicationError(
        "Something went wrong with database while getting all posts...",
        500
      );
    }

    // if (posts.length == 0) {
    //   throw new ApplicationError("No posts yet... Add new post?", 400);
    // }
    // return posts;
  }

  async newPost(post) {
    try {
      const newPost = new PostModel(post);
      return await newPost.save();
    } catch (error) {
      console.error(error);
      throw new ApplicationError(
        "Something went wrong with database while adding post...",
        500
      );
    }

    // post.id = posts.length + 1;
    // posts.push(post);
    // return post;
  }

  async getPostById(id) {
    try {
      const postById = await PostModel.findById(id);
      return postById;
    } catch (error) {
      console.error(error);
      throw new ApplicationError(
        "Something went wrong with database while gettig post by ID...",
        500
      );
    }

    // const post = posts.find((i) => i.id == id);

    // if (!post) {
    //   throw new ApplicationError("Post not found...", 404);
    // }

    // return post;
  }

  async filterByUser(userId) {
    try {
      const postByUserId = await PostModel.find({
        userId: new ObjectId(userId),
      });
      console.log(postByUserId);

      if (!postByUserId) {
        throw new ApplicationError("User haven't posted anything yet...", 404);
      }

      return postByUserId;
    } catch (error) {
      console.error(error);
      throw new ApplicationError(
        "Something went wrong with database while gettig post by ID...",
        500
      );
    }

    // const result = posts.find((post) => post.userId == userId);
    // const filteredPost = posts.filter((post) => post.userId == userId);

    // if (!result) {
    //   throw new ApplicationError("User haven't posted anything yet...", 404);
    // }

    // return filteredPost;
  }

  async deletePostById(postId, userId) {
    try {
      const deleteById = await PostModel.findByIdAndDelete(postId, {
        userId: userId,
      });
      return deleteById;
    } catch (error) {
      console.error(error);
      throw new ApplicationError(
        "Something went wrong with database while deleting post by ID...",
        500
      );
    }

    // const postIndex = posts.findIndex(
    //   (i) => i.id == postId && i.userId == userId
    // );
    // if (postIndex == -1) {
    //   throw new ApplicationError("Post not found...", 404);
    // } else {
    //   posts.splice(postIndex, 1);
    //   return true;
    // }
  }

  async updatePostById(postId, userId, updatedData) {
    try {
      const updatePostById = await PostModel.findByIdAndUpdate(
        { _id: postId, userId: userId },
        updatedData,
        { new: true }
      );
      return updatePostById;
    } catch (error) {
      console.error(error);
      throw new ApplicationError(
        "Something went wrong with database while updating post by ID...",
        500
      );
    }

    // const postIndex = posts.findIndex(
    //   (i) => i.id == postId && i.userId == userId
    // );
    // if (postIndex == -1) {
    //   throw new ApplicationError("Post not found...", 400);
    // } else {
    //   posts[postIndex] = { ...posts[postIndex], ...updatedData };
    //   return posts[postIndex];
    // }
  }
}
