import { LikeRepository } from "./likes.repository.js";

export default class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  async toggleLike(req, res) {
    try {
      const userId = req.userID;
      const postId = req.params.postId;
      const liked = true;

      const result = await this.likeRepository.toogleLikes(
        postId,
        userId,
        liked
      );

      if (!result) {
        return res.status(404).send("Post not found...");
      }

      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Something went wrong");
    }
  }

  async getAll(req, res) {
    try {
      const id = req.params.postId;
      const likes = await this.likeRepository.getAllLikes(id);

      if (likes.length < 1) {
        return res.status(404).json("No Likes Found...");
      }

      res.status(200).send(likes);
    } catch (error) {
      console.log(error);
      return res.status(200).send("Something went wrong");
    }
  }
}
