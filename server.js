import "./env.js";
import express from "express";
import userRouter from "./src/features/user/user.routes.js";
import postRouter from "./src/features/posts/post.routes.js";
import commentRouter from "./src/features/comments/comments.routes.js";
import jwtAuth from "./src/middleware/jwt.middleware.js";
import likeRoutes from "./src/features/likes/likes.routes.js";
import { ApplicationError } from "./src/error/applicationError.js";
import loggerMiddleware, {
  logger1,
} from "./src/middleware/logger.middleware.js";
import swagger from "swagger-ui-express";
import apiDocs from "./swagger.json" assert { type: "json" };
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import mongoose from "mongoose";
import friendsRoutes from "./src/features/friends/friends.routes.js";
import cors from "cors";
import bodyParser from "body-parser";
import otpRoutes from "./src/features/otp/otp.routes.js";

const server = express();

server.use(
  cors({
    origin: "*",
  })
);

server.use(bodyParser.json());
server.use(express.static("public"));
server.use(express.json());
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

server.use("/api/", userRouter);

server.use(loggerMiddleware);

// All routes are here
server.use("/api/users/", userRouter);
server.use("/api/posts/", jwtAuth, postRouter);
server.use("/api/comments/", jwtAuth, commentRouter);
server.use("/api/likes/", jwtAuth, likeRoutes);
server.use("/api/friends/", jwtAuth, friendsRoutes);
server.use("/api/otp/", jwtAuth, otpRoutes);

server.get("/", (req, res) => {
  res.send("Welcome to Postaway...");
});

server.use((err, req, res, next) => {
  // console.log(err);

  if (err instanceof mongoose.Error.ValidationError) {
    const logData = `(Timestamp: ${new Date().toString()}) -- (request Url: ${
      req.url
    }) -- (error message: ${err.message})`;
    logger1.error(logData);
    return res.status(400).send(err.message);
  }

  if (err instanceof ApplicationError) {
    const logData = `(Timestamp: ${new Date().toString()}) -- (request Url: ${
      req.url
    }) -- (error message: ${err.message})`;
    logger1.error(logData);
    res.status(err.code).send(err.message);
  } else {
    // server errors
    const logData = `(Timestamp: ${new Date().toString()}) -- (request Url: ${
      req.url
    }) -- (error message: ${err.message})`;
    logger1.error(logData);
    res.status(500).send("Something went wrong, please try later");
  }
});

server.use((req, res) => {
  res
    .status(404)
    .send(
      "API not found... Reffer to http://localhost:3000/api-docs/ to know proper routes..."
    );
});

server.listen(3000, () => {
  console.log("Server listening on port 3000...");
  connectUsingMongoose();
});
