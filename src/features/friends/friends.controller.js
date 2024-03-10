import { FriendsRepository } from "./friends.repository.js";

export default class FriendsController {
  constructor() {
    this.friendsRepository = new FriendsRepository();
  }

  async getAllFriends(req, res) {
    try {
      console.log("Controller Entered");
      const userId = req.params.userId;
      const friends = await this.friendsRepository.getFriends(userId);

      console.log(friends);
      res.status(200).send(friends);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Something went wrong");
    }
  }

  async getAllPendingFriendRequests(req, res) {
    try {
      console.log("Controller Entered");
      const userId = req.userID;
      const friends = await this.friendsRepository.getPendingFriendRequests(
        userId
      );

      console.log(friends);
      res.status(200).send(friends);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Something went wrong");
    }
  }

  async toggleFriends(req, res) {
    try {
      const friendId = req.params.friendId;
      const userId = req.userID;

      const toggle = await this.friendsRepository.toggleFriendship(
        friendId,
        userId
      );

      res.status(200).send(toggle);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Something went wrong");
    }
  }

  async respondToFriendRequest(req, res) {
    try {
      const userId = req.userID;
      const friendId = req.params.friendId;
      const response = req.body.response;

      const isPending = await this.friendsRepository.respondToRequest(
        friendId,
        userId,
        response
      );

      if (!isPending) {
        return res
          .status(400)
          .json({ Status: "Failure", Message: "Something went wrong" });
      }

      res.status(200).send(isPending);
    } catch (error) {}
  }
}
