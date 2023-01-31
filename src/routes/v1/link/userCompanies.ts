import Router from "express";
import mongoose from "mongoose";
import { IUser } from "../../../models/user";

const User = mongoose.model("User");

const router = Router();

router.get("/:userId", async (req, res) => {
  const userId: string = req.params.userId;

  try {
    if (userId === null || userId === undefined) {
      throw new Error("UserId not found!");
    }
    const user: IUser | null = await User.findById(userId);

    if (!user) {
      throw new Error("User not found!");
    }

    return res.status(200).json({
      success: true,
      companyName: user.companyName,
    });
  } catch (error: any) {
    console.log(error);
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
