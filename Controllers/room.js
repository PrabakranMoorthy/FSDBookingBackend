import Room from "../Models/Room.js";
import Hotel from "../Models/Hotel.js";
import { createError } from "../Utils/error.js";

//createRoom
export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);
  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};

//updateRoom
export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};

//UpdateRoomAvailability
export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id.split("_")[1] },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates,
        },
      }
    );
    res.status(200).json("Room status has been updated.");
  } catch (err) {
    next(err);
  }
};

//DeleteRoom
export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};

//GetRoom
export const getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};

//GetRooms
export const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};

export const bookRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.body.firstDropdownRoom.split("_")[0]);
    const userStartDate = new Date(req.body.startDate);
    const userEndDate = new Date(req.body.endDate);
    let flag = true;
    room.roomNumbers.forEach((roomNumber) => {
      if (roomNumber._id == req.body.firstDropdownRoom.split("_")[1]) {
        const dateArray = roomNumber.unavailableDates;
        for (let i = 0; i < dateArray.length; i += 2) {
          const existingStartDate = new Date(dateArray[i]);
          const existingEndDate = new Date(dateArray[i + 1]);

          if (
            userStartDate < existingEndDate &&
            userEndDate > existingStartDate
          ) {
            flag = false;
            break;
          }
        }
      }
    });
    if (flag) {
      await Room.updateOne(
        { "roomNumbers._id": req.body.firstDropdownRoom.split("_")[1] },
        {
          $push: {
            "roomNumbers.$.unavailableDates": [userStartDate, userEndDate],
          },
        }
      );
      res.status(200).json({ message: "Room booked successfully!" });
    } else {
      res.status(422).json({
        error: "Validation Error",
        message: "The room is unavailable for the selected dates.",
      });
    }
  } catch (err) {
    next(err);
  }
};
