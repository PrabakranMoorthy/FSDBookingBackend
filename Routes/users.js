import express from "express";

import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../Controllers/user.js";
import {  verifyToken, verifyUser , verifyAdmin } from "../Utils/verifyToken.js";

/*
router.get("/checkauthentication", verifyToken, (req,res,next)=>{
  res.send("hello user, you are logged in") })

router.get("/checkuser/:id", verifyUser, (req,res,next)=>{
  res.send("hello user, you are logged in and you can delete your account")
 })
 router.get("/checkadmin/:id", verifyAdmin, (req,res,next)=>{
  res.send("hello admin, you are logged in and you can delete all accounts")
 })
*/

const router = express.Router();
//UPDATE
router.put("/:id",verifyUser,  updateUser);

//DELETE
router.delete("/:id",verifyUser, deleteUser);

//GET
router.get("/:id",verifyUser,  getUser);

//GET ALL
router.get("/",verifyAdmin,  getUsers);

export default router;
