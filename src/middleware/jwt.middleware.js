import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtAuth = (req, res, next) => {
  // 1. Read the token
  console.log(req.headers);
  const token = req.headers["authorization"];

  // 2. If no token, return the error.
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  // 3. Check if token is valid
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userID = payload.userID;
    console.log(payload);
  } catch (err) {
    // 4. Return error.
    return res.status(401).send("Unauthorized");
  }

  // 5. Call next middleware
  next();
};

export default jwtAuth;
