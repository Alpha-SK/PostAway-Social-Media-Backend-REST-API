import express from "express";
import FriendsController from "./friends.controller.js";

const friendsRoutes = express.Router();
const friendsController = new FriendsController();

// routes for like api
// Retrieve all likes for specific post
friendsRoutes.get("/get-friends/:userId", (req, res) => {
  friendsController.getAllFriends(req, res);
});
friendsRoutes.get("/get-pending-requests", (req, res) => {
  friendsController.getAllPendingFriendRequests(req, res);
});
friendsRoutes.put("/toggle-friendship/:friendId", (req, res) => {
  friendsController.toggleFriends(req, res);
});
friendsRoutes.post("/response-to-request/:friendId", (req, res) => {
  friendsController.respondToFriendRequest(req, res);
});

export default friendsRoutes;
