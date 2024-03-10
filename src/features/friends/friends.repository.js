import mongoose from "mongoose";
import { friendsSchema } from "./friends.schema.js";
import { UserModel } from "../user/user.repository.js";

const FriendsModel = new mongoose.model("Friend", friendsSchema);

export class FriendsRepository {
  async getFriends(userId) {
    try {
      const allFriends = await FriendsModel.findOne({ user: userId });

      console.log(allFriends.friends);
      if (!allFriends) {
        return false;
      }

      return allFriends.friends;
    } catch (error) {
      console.error(error);
      throw new ApplicationError(
        "Something went wrong with database while getting all friends...",
        500
      );
    }
  }

  async getPendingFriendRequests(userId) {
    try {
      const pendingRequests = await FriendsModel.findOne({ user: userId });

      console.log(pendingRequests.pending_requests);
      if (!pendingRequests) {
        return false;
      }

      return pendingRequests.pending_requests;
    } catch (error) {
      console.error(error);
      throw new ApplicationError(
        "Something went wrong with database while getting all friends...",
        500
      );
    }
  }

  async toggleFriendship(friendId, userId) {
    try {
      // await new FriendsModel({
      //   user: userId,
      //   pending_requests: [
      //     {
      //       user: friendId,
      //       status: "Pending",
      //     },
      //   ],
      //   friends: [],
      //   __v: 1,
      // }).save();

      const findRequest = await FriendsModel.findOne({ user: userId });

      if (!findRequest) {
        return false;
      }

      console.log(findRequest.friends);
      const friend = findRequest.friends.find((f) => f.user.equals(friendId));

      if (!friend) {
        // Friend not found
        return false;
      }

      const newStatus = friend.status === "Friend" ? "Not Friend" : "Friend";

      const updatedFriend = await FriendsModel.findOneAndUpdate(
        {
          user: userId,
          "friends.user": friendId,
        },
        {
          $set: {
            "friends.$.status": newStatus,
          },
        },
        { new: true }
      );

      return updatedFriend;
    } catch (error) {
      console.error(error);
      throw new ApplicationError(
        "Something went wrong with database while toggling friend...",
        500
      );
    }
  }

  async respondToRequest(friendId, userId, response) {
    try {
      const findRequest = await FriendsModel.findOne({ user: userId });

      if (!findRequest) {
        return false; // User not found
      }

      const pendingRequestIndex = findRequest.pending_requests.findIndex((f) =>
        f.user.equals(friendId)
      );

      if (pendingRequestIndex === -1) {
        return false; // Pending request not found
      }

      const pendingRequest = findRequest.pending_requests[pendingRequestIndex];

      if (pendingRequest.status === "Pending" && response === "Accept") {
        // Accept the friend request
        findRequest.pending_requests.splice(pendingRequestIndex, 1); // Remove from pending requests
        findRequest.friends.push({ user: friendId, status: "Friend" }); // Add to friends
      } else if (response === "Reject") {
        // Reject the friend request
        findRequest.pending_requests.splice(pendingRequestIndex, 1); // Remove from pending requests
      }

      await findRequest.save(); // Save the changes

      return "Responded to friend request";
    } catch (error) {
      console.error(error);
      throw new ApplicationError(
        "Something went wrong with the database while responding to the friend request...",
        500
      );
    }
  }
}
