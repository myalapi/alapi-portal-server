import Router from "express";
import logger from "../../../logger";
const router = Router();
import authMiddle from "../../../middlewares/authMiddle";
import * as awsUtils from "../../../utils/awsUtils";
import IP from 'ip';


router.get("/:platformKey", authMiddle, async (req, res) => {
  const platformKey = req.params.platformKey;
  const user: any = req.body.user;

  try {
    if (platformKey === undefined || platformKey === null) {
      throw new Error(`Invalid platform Id provided`);
    }
    let platforms = user.platforms;
    for (var i = 0; i < platforms.length; i++) {
      if (
        platforms[i].platformKey.localeCompare(platformKey) === 0 &&
        platforms[i].isConfigured === true
      ) {
        const creds = await awsUtils.getSecret(platforms[i].awsSecretName);
        return res.send({ success: true, credentials: creds });
      }
    }
    logger.log({
      level: "info",
      message: `Get platform Credentials API, ip: ${IP.address()} userId: ${user._id} platformKey: ${platformKey} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.send({ isConfigured: false });
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Get platform Credentials API, ip: ${IP.address()} error: ${error.message} userId: ${user._id} platformKey: ${platformKey} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.send(error.message);
  }
});

router.post("/", authMiddle, async (req, res) => {
  const { user, platformKey, credentials } = req.body;
  try {
    if (
      platformKey === undefined ||
      platformKey === null ||
      credentials == null ||
      credentials === undefined
    ) {
      throw new Error("Platform Key not found");
    }
    let platforms = user.platforms;
    if (platforms === undefined || platforms === null) {
      platforms = [];
    } else {
      for (var i = 0; i < platforms.length; i++) {
        if (platforms[i].platformKey.localeCompare(platformKey) === 0) {
          throw new Error("Platform Already Exists");
        }
      }
    }

    const secretName = await awsUtils.createSecret(
      `${user.id.slice(6) + platformKey}`,
      credentials
    );
    const platform = {
      platformKey: platformKey,
      awsSecretName: secretName,
      isEnabled: true,
      isConfigured: true,
    };

    platforms.push(platform);
    await user.updateOne({ platforms: platforms });
    logger.log({
      level: "info",
      message: `Configure platform API, ip: ${IP.address()} userId: ${user._id} platformKey: ${platformKey} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.send({
      success: true,
      message: "platform created successfully",
    });
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Configure platform API, ip: ${IP.address()} error: ${error.message} userId: ${user._id} platformKey: ${platformKey} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.send({ success: false, message: error.message });
  }
});

router.put("/", authMiddle, async (req, res) => {
  const { user, platformKey, credentials } = req.body;
  try {
    if (
      platformKey === undefined ||
      platformKey === null ||
      credentials == null ||
      credentials === undefined
    ) {
      throw new Error("Platform Key not found");
    }
    await awsUtils.updateSecret(
      `${user.id.slice(6) + platformKey}`,
      credentials
    );
    logger.log({
      level: "info",
      message: `Update platform Credentials API, ip: ${IP.address()} userId: ${user._id} platformKey: ${platformKey} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.send(200);
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Update platform credentials API, ip: ${IP.address()} error: ${error.message} userId: ${user._id} platformKey: ${platformKey} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.send(error.message);
  }
});

router.delete("/:platformKey", authMiddle, async (req, res) => {
  const platformKey = req.params.platformKey;
  const user: any = req.body.user;

  try {
    if (platformKey === undefined || platformKey === null) {
      throw new Error("Platform Key not found");
    }
    let platforms = user.platforms;
    for (var i = 0; i < platforms.length; i++) {
      if (platforms[i].platformKey === platformKey) {
        await awsUtils.deleteSecret(`${platforms[i].awsSecretName}`);
        platforms.splice(i, 1);
        await user.updateOne({ platforms: platforms });
        break;
      }
    }
    logger.log({
      level: "info",
      message: `Delete platform Credentials API, ip: ${IP.address()} userId: ${user._id} platformKey: ${platformKey} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.sendStatus(200);
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Delete platform Credentials API, ip: ${IP.address()} error: ${error.message} userId: ${user._id} platformKey: ${platformKey} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.send(error.message);
  }
});

module.exports = router;
