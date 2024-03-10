import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error/applicationError.js";
import { profileSchema } from "./profile.schema.js";

export const UserModel = mongoose.model("User", userSchema);
const ProfileModel = mongoose.model("Profile", profileSchema);

export default class UserRepository {
  async signUp(user) {
    try {
      const newUser = new UserModel(user);
      await newUser.save();
      return newUser;
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw error;
      } else {
        console.error(error);
        throw new ApplicationError(
          "Something went wrong with the database",
          500
        );
      }
    }

    // console.log(name);
    // if (name.length < 2 || !email.includes("@") || password < 6) {
    //   throw new ApplicationError(
    //     "Invalid credentials, please provide proper credentials...",
    //     406
    //   );
    // }

    // const newUser = new UserModel(users.length + 1, name, email, password);
    // users.push(newUser);
    // return newUser;
  }

  async signIn(email, password) {
    try {
      return await UserModel.findOne({ email, password });
    } catch (error) {
      console.error(error);
      throw new ApplicationError("Something went wrong with the database", 500);
    }

    // const user = users.find((u) => u.email == email && u.password == password);
    // return user;
  }

  async findByEmail(email) {
    try {
      return await UserModel.findOne({ email });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with database", 500);
    }
  }

  async getUserDetails(userId) {
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        return false;
      }

      const userProfile = await ProfileModel.findOne({ user: userId });
      if (userProfile) {
        return userProfile;
      }

      const newUserProfile = new ProfileModel({
        user: user._id,
        name: user.name,
        email: user.email,
      });
      await newUserProfile.save();
      return newUserProfile;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong with database while geting profiles",
        500
      );
    }
  }

  async getAllUserDetails() {
    try {
      const users = await UserModel.find();

      const userProfiles = await Promise.all(
        users.map(async (user) => {
          const userProfile = await ProfileModel.findOne({ user: user._id });
          if (userProfile) {
            return userProfile;
          }

          const newUserProfile = new ProfileModel({
            user: user._id,
            name: user.name,
            email: user.email,
          });
          await newUserProfile.save();
          return newUserProfile;
        })
      );
      return userProfiles;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong with database while geting all profiles",
        500
      );
    }
  }

  async updateDetails(userId, updatedData) {
    try {
      const updateProfileById = await ProfileModel.findOneAndUpdate(
        { user: userId },
        updatedData,
        { new: true }
      );
      await UserModel.findByIdAndUpdate(userId, updatedData, { new: true });

      return updateProfileById;
    } catch (error) {
      console.log(error);
      throw new ApplicationError(
        "Something went wrong with database while geting all profiles",
        500
      );
    }
  }
}
