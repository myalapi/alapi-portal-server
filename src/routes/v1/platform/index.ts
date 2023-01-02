import Router from "express";
const router = Router();
import mongoose from "mongoose";
import authMiddle from "../../../middlewares/authMiddle";

const Platforms = mongoose.model("Platforms");

router.get("/", authMiddle, async (req, res) => {
  const user = req.body.user;

  const platforms:any[]= await Platforms.find({});
  const connectedPlatforms = user.platforms;
  
  for (var i = 0; i < connectedPlatforms.length; i++) {
    const connectedPlatform: any = connectedPlatforms[i];    
    for (var j = 0; j < platforms.length; j++) {
      if (connectedPlatform.platformKey === platforms[j].platformKey) {
        platforms[j] = { ...connectedPlatform.toObject(), ...platforms[j].toObject() };
      }
    }
  }
  res.send(platforms);
});

router.get("/:platformKey", authMiddle, async (req, res) => {
  const platformKey = req.params.platformKey;
  const user = req.body.user;

  try {
    if (platformKey === undefined || platformKey === null) {
      throw new Error(`Invalid platform Id provided`);
    }
    let platforms = user.platforms;
    for (var i = 0; i < platforms.length; i++) {
      if (platforms[i].platformKey === platformKey) {
        return res.send({ isConfigured: true, platform: platforms[i] });
      }
    }
    const platform = await Platforms.findOne({ platformKey });
    return res.send({ isConfigured: false, platform: platform });
  } catch (error: any) {
    console.log(error);
    return res.send(error.message);
  }
});

router.post("/create", authMiddle, async (req, res) => {
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
    const platform = {
      platformKey: platformKey,
      credentials,
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

router.put("/update", authMiddle, async (req, res) => {
  const { user, platformKey, isEnabled } = req.body;
  try {
    if (
      platformKey == null ||
      platformKey === undefined ||
      isEnabled === undefined ||
      isEnabled == ""
    ) {
      throw new Error("Platform Id not found");
    }
    let platforms = user.platforms;
    for (var i = 0; i < platforms.length; i++) {
      if (platforms[i].platformKey === platformKey) {
        platforms[i].isEnabled = isEnabled;
        await user.updateOne({ platforms: platforms });
        return res.sendStatus(200);
      }
    }
    throw new Error("Invalid Platform ID: " + platformKey);
  } catch (error: any) {
    console.log(error);

    return res.send(error.message);
  }
});

module.exports = router;