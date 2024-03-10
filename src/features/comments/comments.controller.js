import { CommentRepository } from "./comments.repository.js";

export default class CommentController {
  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async addComment(req, res) {
    try {
      const userId = req.userID;
      const postId = req.params.postId;
      const content = req.body.content;

      const result = await this.commentRepository.newComment(
        userId,
        postId,
        content
      );
      if (!result) {
        return res.status(404).send("Post not found");
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(400).send("Something went wrong while adding new comment");
    }
  }

  async getAll(req, res) {
    try {
      const postId = req.params.postId;
      const result = await this.commentRepository.getAllComments(postId);
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(400).send("Something went wrong while getting all comment");
    }
  }

  async delete(req, res) {
    try {
      const userId = req.userID;
      const postId = req.query.postId;
      const commentId = req.params.id;
      const result = await this.commentRepository.delete(
        postId,
        userId,
        commentId
      );

      if (!result) {
        return res.status(404).send("Comment not found...");
      }

      return res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(400).send("Something went wrong while deleting comment");
    }
  }

  async updateComment(req, res) {
    try {
      const commentId = req.params.id;
      const postId = req.query.postId;
      const updatedData = req.body;

      const updatedComment = await this.commentRepository.updateCommentById(
        postId,
        commentId,
        updatedData
      );

      return res.status(200).json(updatedComment);
    } catch (error) {
      console.error(error);
      res.status(400).send("Something went wrong while deleting comment");
    }
  }

}
