import Router from "express";
import mongoose from "mongoose";
import logger from "../../../logger";
import { IUser } from "../../../models/user";
import IP from 'ip';


const User = mongoose.model("Users");

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
    logger.log({
      level: "info",
      message: `Link portal: User-Merchants API, ip: ${IP.address()} userId: ${userId} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.status(200).json({
      success: true,
      companyName: user.companyName,
    });
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Link portal: User-Merchants API, ip: ${IP.address()} error: ${error.message} userId: ${userId} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
