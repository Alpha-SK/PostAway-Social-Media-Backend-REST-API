import multer from "multer";
import PostRepository from "./post.repository.js";
import { ObjectId } from "mongodb";

const storage = multer.diskStorage({
  // destination: "./uploads", // Destination folder for uploads
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique file name
  },
});

// const upload = multer({ storage: storage });

export default class PostController {
  constructor() {
    this.postRepository = new PostRepository();
  }
  // getUserPost(req, res) {
  //   const userId = req.params.userId;
  //   const post = PostModel.getPostByUser(userId);
  //   if (!post) {
  //     res.status(404).send("Post Not Found... ");
  //   } else {
  //     res.status(200).send(post);
  //   }
  // }
  async getAllPosts(req, res) {
    try {
      const posts = await this.postRepository.getAll();

      if (posts.length < 1) {
        return res
          .status(404)
          .json({ Status: "Failure", Message: "No posts found..." });
      }

      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(400).send("Something went wrong while getting al posts");
    }

    // const posts = PostModel.getAll();
    // res.status(200).json(posts);
  }

  async newPosts(req, res) {
    try {
      console.log(req);
      const userId = req.userID;
      const caption = req.body.caption;

      const newPost = {
        userId,
        caption,
        imageUrl: req.file.filename,
      };

      const createdRecord = await this.postRepository.newPost(newPost);
      res.status(201).json(createdRecord);
    } catch (error) {
      console.error(error);
      res.status(400).send("Something went wrong while adding new post");
    }
  }

  async getById(req, res) {
    try {
      const id = req.params.id;
      const post = await this.postRepository.getPostById(id);
      res.status(200).send(post);
    } catch (error) {
      console.error(error);
      res.status(400).send("Something went wrong while getting post by ID");
    }
  }

  async filterUser(req, res) {
    try {
      const userId = req.query.userId;
      console.log(userId);
      const result = await this.postRepository.filterByUser(userId);
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res
        .status(400)
        .send("Something went wrong while filtering posts by user");
    }
  }

  async deletePost(req, res) {
    try {
      const userId = req.userID;
      const postId = req.params.id;
      console.log(userId, postId);
      const result = await this.postRepository.deletePostById(postId, userId);

      if (!result) {
        return res
          .status(404)
          .json({ Status: "Failure", Message: "Post not Found..." });
      }

      res.status(200).send("Post deleted successfully...");
    } catch (error) {
      console.error(error);
      res.status(400).send("Something went wrong while deleting posts by ID");
    }
  }

  async updatePostWithImage(req, res) {
    try {
      const postId = req.params.id;
      const userId = req.userID;
      const updatedData = req.body;

      try {
        if (req.file.filename) {
          const imagePath = req.file.filename;

          if (imagePath) {
            updatedData.imageUrl = imagePath;
          }
        }
      } catch (error) {}

      const updatedPost = await this.postRepository.updatePostById(
        postId,
        userId,
        updatedData
      );

      if (!updatedPost) {
        return res
          .status(404)
          .json({ Status: "Failure", Message: "Post not found..." });
      }

      return res.status(200).json(updatedPost);
    } catch (error) {
      console.error(error);
      res.status(400).send("Something went wrong while updating post by ID");
    }
  }
}
