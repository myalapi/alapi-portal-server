import Router from "express";
import authMiddle from "../../../middlewares/authMiddle";

const router = Router();

router.put("/", authMiddle, async (req, res) => {
  const user = req.body.user;
  const updateInfo = req.body.updateInfo;  
  try {
    if(updateInfo===undefined || updateInfo === null) throw new Error("Info missing");
    await user.updateOne({ email: user.email }, { $set: { ...updateInfo } });
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
