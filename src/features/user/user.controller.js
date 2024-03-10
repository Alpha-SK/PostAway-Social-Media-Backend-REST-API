import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from "bcrypt";
import { ApplicationError } from "../../error/applicationError.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async signUp(req, res, next) {
    try {
      const { name, email, password } = req.body;

      const haspedPassword = await bcrypt.hash(password, 12);

      const user = new UserModel(name, email, haspedPassword);
      await this.userRepository.signUp(user);
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      next(error);
    }

    // const { name, email, password } = req.body;
    // const user = UserModel.signUp(name, email, password);
    // res.status(200).json(user);
  }

  async signIn(req, res) {
    try {
      const user = await this.userRepository.findByEmail(req.body.email);

      if (!user) {
        return res.status(401).json({
          Status: "Login failed... Access Denined",
          Message: "Incorrect Credentials",
        });
      } else {
        const result = bcrypt.compare(req.body.password, user.password);

        if (result) {
          const token = jwt.sign(
            { userID: user._id, email: user.email },
            "5sF9Lgzf8B31d78GlMUh4Eh5nn5S6veA",
            { expiresIn: "1h" }
          );

          return res.status(200).json({
            Status: "Successfully logged in... Access Granted",
            token: token,
          });
        } else {
          return res.status(401).json({
            Status: "Login failed... Access Denined",
            Message: "Incorrect Credentials",
          });
        }
      }
    } catch (error) {
      console.error(error);
      throw new ApplicationError("Something went wrong during login...", 500);
    }
  }

  async logout(req, res) {
    try {
      let randomNumberToAppend = toString(Math.floor(Math.random() * 1000 + 1));
      let hashedRandomNumberToAppend = await bcrypt.hash(
        randomNumberToAppend,
        10
      );

      // now just concat the hashed random number to the end of the token
      console.log(req.headers["authorization"]);
      req.headers["authorization"] =
        req.headers["authorization"] + hashedRandomNumberToAppend;
      console.log(req.headers["authorization"]);

      return res.status(200).json({
        Status: "Logged Out...",
        Message: "Logged out successfully.",
      });
    } catch (error) {
      console.error(error);
      throw new ApplicationError("Something went wrong during logout...", 500);
    }
  }

  async userDetails(req, res) {
    try {
      const userId = req.params.userId;

      const userProfile = await this.userRepository.getUserDetails(userId);

      if (!userProfile) {
        return res.status(404).send("User not found...");
      }

      res.status(200).send(userProfile);
    } catch (error) {
      console.error(error);
      throw new ApplicationError(
        "Something went wrong during feting user profile...",
        500
      );
    }
  }

  async allUsersDetails(req, res) {
    try {
      const allUserProfiles = await this.userRepository.getAllUserDetails();
      res.status(200).send(allUserProfiles);
    } catch (error) {}
  }

  async updateProfileById(req, res) {
    try {
      const userId = req.params.userId;
      const updatedData = req.body;

      const updatedProfile = await this.userRepository.updateDetails(
        userId,
        updatedData
      );

      if (!updatedProfile) {
        return res
          .status(404)
          .json({ Status: "Failure", Message: "User not found..." });
      }
      return res.status(200).json(updatedProfile);
    } catch (error) {
      console.error(error);
      res.status(400).send("Something went wrong while updating profile by ID");
    }
  }
}
