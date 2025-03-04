import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./Routes/auth.js";
import usersRoute from "./Routes/users.js";
import hotelsRoute from "./Routes/hotels.js";
import roomsRoute from "./Routes/rooms.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

//middlewares
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://fsd-booking-frontend-system-pzbelc7rb.vercel.app"], // Your frontend's URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // Allow credentials (cookies, headers)
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(process.env.PORT || 8800, () => {
  connect();
  console.log("Connected to backend  🎄✨");
});
app.get("/", (req, res) => {
  res.send(`Hello  World ✨🎉✨`);
});
