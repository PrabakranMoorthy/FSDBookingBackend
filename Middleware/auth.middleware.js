import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  //const token = req.header("Authorization"); // 1st method
  const token = req.headers.authorization?.split(" ")[1]; // split(' ') [1] => bearer token

  if (!token) {
    return res.status(401).json({ message: "Token Missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id).select("-password");
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Middleware for admin functionalites

export const adminMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // split(' ') [1] => bearer token

  if (!token) {
    return res.status(401).json({ message: "Token Missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decoded);
    req.user = decoded;
    //console.log(req.user);
    const user = await User.findById(req.user._id);

    if (user.role === "Admin") {
      next();
    } else {
      res.status(403).json({ message: "Only Admin Can perform the operation" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default authMiddleware;