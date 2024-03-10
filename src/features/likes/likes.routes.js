import express from "express";
import LikeController from "./likes.controller.js";

const likeRoutes = express.Router();
const likeController = new LikeController();

// routes for like api
// Retrieve all likes for specific post
likeRoutes.get("/:postId", (req, res) => {
  likeController.getAll(req, res);
});

// toogle like status for specific post
likeRoutes.get("/toggle/:postId", (req, res) => {
  likeController.toggleLike(req, res);
});

export default likeRoutes;
