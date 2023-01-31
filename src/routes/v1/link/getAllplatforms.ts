import { IPlatform } from "./../../../models/platform";
import Router from "express";
import mongoose from "mongoose";
const User = mongoose.model("User");
const Merchant = mongoose.model("Merchants");
const Platform = mongoose.model("Platforms");

const router = Router();

interface LinkPlatform extends Partial<IPlatform> {
  isConnected?: Boolean;
}

router.get("/:companyId", async (req, res) => {
  try {
    const merchantId = req.params.companyId;

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
    const merchantPlatformArray = Object.keys(merchant.platforms);
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
    return res.status(200).json({
      success: true,
      platforms,
    });
  } catch (error: any) {
    console.log(error);
    return res.send({ success: false, message: error.message });
  }
});

module.exports = router;
