import { BinaryLike } from "crypto";
import Router from "express";
import authMiddle from "../../../middlewares/authMiddle";
import { validPassword, genPassword } from "../../../utils/userUtils";

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

    return res.json({
      success: true,
      msg: "Password Changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, msg: "Invalid password" });
  }
});

module.exports = router;
