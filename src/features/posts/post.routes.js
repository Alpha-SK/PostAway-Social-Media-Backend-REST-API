import express from "express";
import PostController from "./post.controller.js";
import { upload } from "../../middleware/fileupload.middleware.js";

const postRouter = express.Router();
const postController = new PostController();

// all the paths to controller methods
// Retrieve all posts
postRouter.get("/all", (req, res) => {
  postController.getAllPosts(req, res);
});

//Create a new post(Image Upload Functionality included)
postRouter.post("/", upload.single("imageUrl"), (req, res) => {
  postController.newPosts(req, res);
});

// Retrieve a specific post by id
postRouter.get("/:id", (req, res) => {
  postController.getById(req, res);
});

// Retrieve posts based on user credentials
postRouter.get("/", (req, res) => {
  postController.filterUser(req, res);
});

// Delete a specific post by id
postRouter.delete("/:id", (req, res) => {
  postController.deletePost(req, res);
});

// Update a specific post by ID (image upload functionality included)
postRouter.put("/:id", upload.single("imageUrl"), (req, res) => {
  postController.updatePostWithImage(req, res);
});

export default postRouter;
