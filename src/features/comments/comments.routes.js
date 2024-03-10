import express from "express";
import CommentController from "./comments.controller.js";

const commentRouter = express.Router();
const commentController = new CommentController();

// Routes for comments api
// Retrieve all comments for a specific post
commentRouter.get("/:postId", (req, res) => {
  commentController.getAll(req, res);
});

// Add a new comment to a specific post
commentRouter.post("/:postId", (req, res) => {
  commentController.addComment(req, res);
});

// Delete a specific comment by ID
commentRouter.delete("/:id", (req, res) => {
  commentController.delete(req, res);
});

// Update a specific comment by ID
commentRouter.put("/:id", (req, res) => {
  commentController.updateComment(req, res);
});


export default commentRouter;
