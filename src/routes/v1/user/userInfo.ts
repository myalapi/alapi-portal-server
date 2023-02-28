import Router from "express";
import logger from "../../../logger";
import authMiddle from "../../../middlewares/authMiddle";
import IP from 'ip';

const router = Router();

router.put("/", authMiddle, async (req, res) => {
  const user = req.body.user;
  const updateInfo = req.body.updateInfo;
  try {
    if (updateInfo === undefined || updateInfo === null) throw new Error("Info missing");
    await user.updateOne({ email: user.email }, { $set: { ...updateInfo } });
    logger.log({
      level: "info",
      message: `Update userInfo API, ip: ${IP.address()} updateInfo: ${updateInfo} userId: ${user._id} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.json({
      success: true,
      msg: "Info Updated Successfully",
    });
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Update userInfo API, ip: ${IP.address()} error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.send({ success: false, msg: "Unable to Update" });
  }
});

module.exports = router;
