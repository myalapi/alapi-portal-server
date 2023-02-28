import { IPlatform } from "./../../../models/platform";
import Router from "express";
import mongoose from "mongoose";
import logger from "../../../logger";
const User = mongoose.model("Users");
const Merchant = mongoose.model("Merchants");
const Platform = mongoose.model("Platforms");
import IP from 'ip';


const router = Router();

interface LinkPlatform extends Partial<IPlatform> {
  isConnected?: Boolean;
}

router.get("/:companyId", async (req, res) => {
  const merchantId = req.params.companyId;
  try {
    if (merchantId === null || merchantId === undefined) {
      return res
        .status(401)
        .json({ success: false, message: "comapnyId required" });
    }

    const merchant: any = await Merchant.findById(merchantId);
    if (!merchant) throw new Error(" Merchant not found");

    const userId = merchant.userId;
    const user: any = await User.findById(userId);
    const userPlatforms: any = user.platforms;
    let merchantPlatformArray: string | any[];
    if (merchant.platforms == null || merchant.platforms.length === 0) {
      merchantPlatformArray = [];
    } else {
      merchantPlatformArray = Object.keys(merchant.platforms);
    }

    const platforms: LinkPlatform[] = [];
    for (var i = 0; i < userPlatforms.length; i++) {
      const platform: any = await Platform.findOne({
        platformKey: userPlatforms[i].platformKey,
      });
      if (!platform) {
        return;
      }
      let linkPlatform: LinkPlatform = {
        platformKey: platform.platformKey,
        platformUrl: platform.platformUrl,
        platformName: platform.platformName,
        icon: platform.icon,
      };

      if (merchantPlatformArray.includes(userPlatforms[i].platformKey)) {
        linkPlatform.isConnected = true;
      }
      platforms.push(linkPlatform);
    }
    logger.log({
      level: "info",
      message: `Link portal: get all platforms API, ip: ${IP.address()} merchantId: ${merchantId} userId: ${user.id} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.status(200).json({
      success: true,
      platforms,
      userId,
    });
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Link portal: get all platforms API, ip: ${IP.address()} error: ${error.message} merchantId:${merchantId} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.send({ success: false, message: error.message });
  }
});

module.exports = router;
