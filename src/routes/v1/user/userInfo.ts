import Router from "express";
import mongoose from "mongoose";
import authMiddle from "../../../middlewares/authMiddle";
const User = mongoose.model("User");

const router = Router();

router.put("/", authMiddle, async (req, res) => {
  const user = req.body.user;
  const updateInfo = req.body.updateInfo;
  console.log(req.body);
  
  try {
    if(updateInfo===undefined || updateInfo === null) throw new Error("Info missing");
    await User.updateOne({ email: user.email }, { $set: { ...updateInfo } });
    return res.json({
      success: true,
      msg: "Info Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, msg: "Unable to Update" });
  }
});

module.exports = router;
