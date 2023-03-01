import Router from "express";
// import { IPlatform } from "./../../../models/platform";
const router = Router();
import authMiddle from "../../../middlewares/authMiddle";

import { getPlatformByKey, getPlatforms } from "../../../dal/platform";
import logger from "../../../logger";
import IP from 'ip';



router.use("/credentials", require("./credentials"));


///Api for getting the list of platforms
router.get("/", authMiddle, async (req, res) => {
  const user = req.body.user;
  const platforms: any[] = await getPlatforms();

  const connectedPlatforms = user.platforms;

  for (var i = 0; i < connectedPlatforms.length; i++) {
    const connectedPlatform: any = connectedPlatforms[i];
    for (var j = 0; j < platforms.length; j++) {
      if (connectedPlatform.platformKey === platforms[j].platformKey) {
        platforms[j] = {
          ...connectedPlatform.toObject(),
          ...(platforms[j].toObject()),
        };
      }
    }
  }
  logger.log({
    level: "info",
    message: `Get List of Platforms API, ip: ${IP.address()} userId: ${user._id} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
  });
  res.send({ data: platforms });
});

///Api for getting the all platforms: Merchant
router.get("/allplatforms", authMiddle, async (req, res) => {
  const userId = req.body.user._id;
  const merchantId = req.body.merchant._id;
  try {
    const platforms: any[] = await getPlatforms();
    const platformData: any = {};
    for (var i = 0; i < platforms.length; i++) {
      const platform: any = platforms[i];
      platformData[platform.platformKey] = {
        platformKey: platform.platformKey,
        platformName: platform.platformName,
        icon: platform.icon,
      };
    }
    logger.log({
      level: "info",
      message: `Get all Merchant's Platforms API, ip: ${IP.address()} userId: ${userId} merchantId: ${merchantId} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.status(200).json({
      success: true,
      data: platformData
    });
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Get all Merchant's Platforms API, ip: ${IP.address()} error: ${error.message} userId: ${userId} merchantId: ${merchantId} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.send({ success: false, message: error.message });
  }
});

///Api for checking if configured or not and send configuration form
router.get("/:platformKey", authMiddle, async (req, res) => {
  const platformKey = req.params.platformKey;
  const user = req.body.user;

  try {
    if (platformKey === undefined || platformKey === null) {
      throw new Error(`Invalid platform Id provided`);
    }
    let platforms = user.platforms;

    const platform: any = await getPlatformByKey(platformKey);


    for (var i = 0; i < platforms.length; i++) {
      if (platforms[i].platformKey === platformKey && platforms[i].isConfigured === true) {
        logger.log({
          level: "info",
          message: `Check platform configuration API, ip: ${IP.address()} userId: ${user._id} platformKey: ${platformKey} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
        });
        return res.send({
          isConfigured: true,
          platform: { ...platform.toObject(), ...platforms[i].toObject() },
        });
      }
    }
    return res.send({ isConfigured: false, platform: platform });
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Check platform configuration API, ip: ${IP.address()} error: ${error.message} userId: ${user._id} platformKey: ${platformKey} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.send(error.message);
  }
});


///For updating isEnabled
router.put("/update", authMiddle, async (req, res) => {
  const { user, platformKey, isEnabled } = req.body;
  try {
    if (
      platformKey === null ||
      platformKey === undefined ||
      isEnabled === undefined ||
      isEnabled === ""
    ) {
      throw new Error("Platform Id not found");
    }
    let platforms = user.platforms;
    for (var i = 0; i < platforms.length; i++) {
      if (platforms[i].platformKey === platformKey) {
        platforms[i].isEnabled = isEnabled;
        await user.updateOne({ platforms: platforms });
        logger.log({
          level: "info",
          message: `Update platform: enable/disable API, ip: ${IP.address()} userId: ${user._id} platformKey: ${platformKey} isEnabled: ${isEnabled} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
        });
        return res.send({ success: true });
      }
    }
    logger.log({
      level: "warn",
      message: `Update platform: enable/disable API, Warn: Invalid platformKey ip: ${IP.address()} userId: ${user._id} platformKey: ${platformKey} isEnabled: ${isEnabled} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    throw new Error("Invalid Platform ID: " + platformKey);
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Update platform: enable/disable API, ip: ${IP.address()} error: ${error.message} userId: ${user._id} platformKey: ${platformKey} isEnabled: ${isEnabled} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
