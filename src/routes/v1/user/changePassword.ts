import { BinaryLike } from "crypto";
import Router from "express";
import logger from "../../../logger";
import authMiddle from "../../../middlewares/authMiddle";
import { validPassword, genPassword } from "../../../utils/userUtils";
import IP from 'ip';


const router = Router();

router.post("/", authMiddle, async (req, res) => {
  const user = req.body.user;
  const {
    currentPassword,
    newPassword,
    confirmPassword,
  }: {
    currentPassword: BinaryLike;
    newPassword: BinaryLike;
    confirmPassword: BinaryLike;
  } = req.body;
  try {
    const isValid = validPassword(currentPassword, user.hash, user.salt);
    if (!isValid || newPassword !== confirmPassword) {
      throw new Error("Invalid Password");
    }
    const saltHash = genPassword(newPassword);
    user.salt = saltHash.salt;
    user.hash = saltHash.hash;
    user.save();
    logger.log({
      level: "info",
      message: `Change Password API, ip: ${IP.address()} userId: ${user._id} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.json({
      success: true,
      msg: "Password Changed successfully",
    });
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Change Password API, ip: ${IP.address()} error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.send({ success: false, msg: "Invalid password" });
  }
});

module.exports = router;
