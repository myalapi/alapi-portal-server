import Router from "express";
import User from "../../../models/user";
import Merchants from "../../../models/merchant";

const router = Router();

router.get("/:companyId", async (req, res) => {
    try {
        const merchantId = req.params.companyId;

        if (merchantId === null || merchantId === undefined) {
            return res.status(401).json({ success: false, message: "comapnyId required" });
        }

        const merchant = await Merchants.findById(merchantId);
        const userId = merchant?.userId;
        console.log(userId);
        const user = await User.findById(userId);
        const userPlatforms: any = user.platforms;
        const merchantPlatforms = merchant?.platforms;
        const merchantPlatformArray = Object.keys(merchantPlatforms);
        console.log(merchantPlatformArray);



        for (var i = 0; i < userPlatforms.length; i++) {
            let connectedPlatform = userPlatforms[i];
            if (merchantPlatformArray.includes(connectedPlatform.platformKey)) {
                connectedPlatform.configurationStatus = true;
                console.log(connectedPlatform);
            }
            userPlatforms[i] = {
                ...connectedPlatform.toObject(),
            }

        }
        return res.status(200).json({
            success: true,
            userPlatforms,
        })
    } catch (error: any) {
        console.log(error);
        return res.send({ success: false, message: error.message });
    }
})

module.exports = router;
