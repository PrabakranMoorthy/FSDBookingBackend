import express from "express";
import {
  BigHotel,
  countByCity,
  countByType,
  createHotel,
  deleteHotel,
  getHotel,
  getHotelRooms,
  getHotels,
  updateHotel,
} from "../Controllers/hotel.js";
import { verifyAdmin } from "../Utils/verifyToken.js";
import authMiddleware from "../Middleware/auth.middleware.js";

const router = express.Router();
//CREATE
router.post("/create", verifyAdmin, createHotel);

router.post("/Big", BigHotel);

//UPDATE
router.put("/:id", verifyAdmin, updateHotel);

//DELETE
router.delete("/:id", verifyAdmin, deleteHotel);

//GET Hotel
router.get("/find/:id", getHotel);

//GET ALL Hotels
router.get("/", getHotels);
router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms);

export default router;
