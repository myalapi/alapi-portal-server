import Router from "express";
const router = Router();
import authMiddle from "../../../middlewares/authMiddle";
import * as awsUtils from "../../../utils/awsUtils";

router.get("/:platformKey",authMiddle, async (req, res) => {
  const platformKey = req.params.platformKey;
  console.log(req.body);
  
  const user: any = req.body.user;

  try {
    if (platformKey === undefined || platformKey === null) {
      throw new Error(`Invalid platform Id provided`);
    }
    let platforms = user.platforms;
    for (var i = 0; i < platforms.length; i++) {
      if (
        platforms[i].platformKey === platformKey &&
        platforms[i].isConfigured === true
      ) {
        const creds = await awsUtils.getSecret(platforms[i].awsSecretName);
        return res.send({ success: true, credentials: creds });
      }
    }
    return res.send({ isConfigured: false });
  } catch (error: any) {
    console.log(error);
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
    let platforms = user.platforms;
    if (platforms === undefined || platforms === null) {
      platforms = [];
    }
    platforms.push(platform);
    await user.updateOne({ platforms: platforms });
    return res.send(200);
  } catch (error: any) {
    console.log(error);
    return res.send(error.message);
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
    return res.send(200);
  } catch (error: any) {
    console.log(error);
    return res.send(error.message);
  }
});

router.delete("/", authMiddle, async (req, res) => {
  const { user, platformKey } = req.body;
  try {
    if (platformKey === undefined || platformKey === null) {
      throw new Error("Platform Key not found");
    }
    await awsUtils.deleteSecret(`${user.id.slice(6) + platformKey}`);
    let platforms = user.platforms;
    for (var i = 0; i < platforms.length; i++) {
      if (platforms[i].platformKey === platformKey) {
        platforms[i].isConfigured = false;
        platforms[i].awsSecretName = "";
        await user.updateOne({ platforms: platforms });
        break;
      }
    }
    return res.send(200);
  } catch (error: any) {
    console.log(error);
    return res.send(error.message);
  }
});

module.exports = router;
