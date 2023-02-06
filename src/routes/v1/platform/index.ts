import Router from "express";
const router = Router();
import authMiddle from "../../../middlewares/authMiddle";
import { getPlatformByKey, getPlatforms } from "../../../dal/platform";

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
  res.send({ data: platforms });
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
        return res.send({
          isConfigured: true,
          platform: { ...platform.toObject(), ...platforms[i].toObject() },
        });
      }
    }
    return res.send({ isConfigured: false, platform: platform });
  } catch (error: any) {
    console.log(error);
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
        return res.send({ success: true });
      }
    }
    throw new Error("Invalid Platform ID: " + platformKey);
  } catch (error: any) {
    console.log(error);

    return res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
