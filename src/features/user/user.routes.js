import express from "express";
import UserController from "./user.controller.js";
import jwtAuth from "../../middleware/jwt.middleware.js";

const userRouter = express.Router();
const userController = new UserController();

userRouter.post("/signup", (req, res, next) => {
  userController.signUp(req, res, next);
});
userRouter.post("/signin", (req, res) => {
  userController.signIn(req, res);
});
userRouter.post("/logout", (req, res) => {
  jwtAuth, userController.logout(req, res);
});
userRouter.get("/get-details/:userId", (req, res) => {
  jwtAuth, userController.userDetails(req, res);
});
userRouter.get("/get-all-details", (req, res) => {
  jwtAuth, userController.allUsersDetails(req, res);
});
userRouter.put("/update-details/:userId", (req, res) => {
  jwtAuth, userController.updateProfileById(req, res);
});

export default userRouter;
