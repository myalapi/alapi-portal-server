import { IPlatform } from "../../../models/platform";
import Router from "express";
import querystring from "querystring";
import logger from "../../../logger";
import IP from "ip";
import { getMerchant } from "../../../dal/merchant";
import { getUser } from "../../../dal/user";
import { getPlatformByKey } from "../../../dal/platform";
import platformKeys from "../../../constant/platformKeys";

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

    const merchant: any = await getMerchant(merchantId);
    if (!merchant) throw new Error(" Merchant not found");

    const userId = merchant.userId;
    const user: any = await getUser(userId);
    const userPlatforms: any = user.platforms;
    let merchantPlatformArray: string | any[];
    if (merchant.platforms == null || merchant.platforms.length === 0) {
      merchantPlatformArray = [];
    } else {
      merchantPlatformArray = Object.keys(merchant.platforms);
    }

    const platforms: LinkPlatform[] = [];
    for (var i = 0; i < userPlatforms.length; i++) {
      const platform: any = await getPlatformByKey(
        userPlatforms[i].platformKey
      );
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
      message: `Link portal: get all platforms API, ip: ${IP.address()} merchantId: ${merchantId} userId: ${
        user.id
      } URL: ${req.protocol}://${req.get("host")}${req.originalUrl}`,
    });
    return res.status(200).json({
      success: true,
      platforms,
      userId,
    });
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Link portal: get all platforms API, ip: ${IP.address()} error: ${
        error.message
      } merchantId:${merchantId} URL: ${req.protocol}://${req.get("host")}${
        req.originalUrl
      }`,
    });
    return res.send({ success: false, message: error.message });
  }
});

// Get single platform connection url merchant
router.post("/:platformKey", async (req, res) => {
  const merchantId = req.body.merchantId;
  const platformKey = req.params.platformKey;
  try {
    if (
      platformKey === undefined ||
      platformKey === null ||
      merchantId === undefined ||
      merchantId === null
    ) {
      return res.send({ msg: "Invalid Request" });
    } else {
      //Send to oauth of that platform
      const platform: any = await getPlatformByKey(platformKey);
      if (!platform) throw new Error(`Invalid platformKey `);

      const merchant: any = await getMerchant(merchantId);
      const user: any = await getUser(merchant.userId);
      let platforms = user.platforms;
      for (var i = 0; i < platforms.length; i++) {
        if (
          platformKey.localeCompare(platforms[i].platformKey) == 0 &&
          platforms[i].isConfigured
        ) {
          const url =
            process.env.ALAPI_API_URL +
            "/auth/" +
            platform.platformUrl +
            "?";
          const params: any = {
            userId: user.id,
            merchantId: merchant.id,
          };
          logger.log({
            level: "info",
            message: `Get platform's connection url API, ip: ${IP.address()} userId: ${
              user._id
            } merchantId: ${merchant._id} platformKey: ${platformKey} URL: ${
              req.protocol
            }://${req.get("host")}${req.originalUrl}`,
          });
          return res.send({
            success: true,
            link: url + querystring.encode(params),
          });
        }
      }
      throw new Error(`Platform Access denied`);
    }
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Get platform's connection url API, ip: ${IP.address()} error: ${
        error.message
      } merchantId: ${merchantId} platformKey: ${platformKey} URL: ${
        req.protocol
      }://${req.get("host")}${req.originalUrl}`,
    });
    return res.send({ sucess: false, msg: error.message });
  }
});

// set selected orgainsation in platform
router.post("/:platformKey/org", async (req, res) => {
  const merchantId = req.body.merchantId;
  const organizationId = req.body.organization;
  const platformKey = req.params.platformKey;

  try {
    if (
      platformKey === undefined ||
      platformKey === null ||
      merchantId === undefined ||
      merchantId === null ||
      organizationId === undefined ||
      organizationId === null
    ) {
      throw new Error("Invalid Request"); 
    } else {
      const merchant: any = await getMerchant(merchantId);
      let platforms: any = merchant.platforms;

      if(platforms === null || platforms===undefined) {
        throw new Error("No Platforms found");  
      }

      const platform:any = platforms[platformKey];
      platform.selectedOrganizationId = organizationId;
      platforms[platformKey] = platform;

      merchant.platforms = platforms;
      merchant.markModified("platforms");
      await merchant.save();

      logger.log({
      level: "info",
      message: `create Selected Organization Api, ip: ${IP.address()} merchantId: ${merchantId} 
      platformKey: ${platformKey} organizationId: ${organizationId} URL: ${
        req.protocol
      }://${req.get("host")}${req.originalUrl}`,
    });
      return res.send({success:true, msg: "Merchant saved"}); 
    }
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `create Selected Organization Api, ip: ${IP.address()} error: ${
        error.message
      } merchantId: ${merchantId} platformKey: ${platformKey} organizationId: ${organizationId} URL: ${
        req.protocol
      }://${req.get("host")}${req.originalUrl}`,
    });
    return res.send({ success: false, msg: error.message });
  }
});

// Get merchant zoho organisations
router.post("/:platformkey/info", async (req, res) => {
  const platformKey= req.params.platformkey;
  if(platformKey ===platformKeys.zoho){
      const merchantId = req.body.merchantId;
    try {
      if (merchantId === null || merchantId === undefined) {
        return res
          .status(401)
          .json({ success: false, message: "merchantId required" });
      }

      const merchant: any = await getMerchant(merchantId);
      if (!merchant) throw new Error(" Merchant not found");

      const platforms:any = merchant.platforms;
      if(platforms===null || platforms===undefined) 
          throw new Error("No Platforms found");

      const organizations: { id: any; name: any; }[]= platforms[platformKey].organizations;

      if(organizations===null || organizations===undefined) 
          throw new Error("No Organizations found");
      
      logger.log({
        level: "info",
        message: `Link portal: get Platform zoho organisations, ip: ${IP.address()} merchantId: ${merchantId}
        } URL: ${req.protocol}://${req.get("host")}${req.originalUrl}`,
      });
      return res.status(200).json({
        success: true,
        organizations,
      });
    } catch (error: any) {
      logger.log({
        level: "error",
        message: `Link portal: get Platform zoho organisations, ip: ${IP.address()} error: ${
          error.message
        } merchantId:${merchantId} URL: ${req.protocol}://${req.get("host")}${
          req.originalUrl
        }`,
      });
      return res.send({ success: false, message: error.message });
    }
  }else{
    return res.send(201);
  }

});

module.exports = router;
