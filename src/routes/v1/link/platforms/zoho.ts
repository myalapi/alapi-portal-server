import Router from "express";
import { getMerchant } from "../../../../dal/merchant";
import platformKeys from "../../../../constant/platformKeys";
const router = Router();
import logger from "../../../../logger";
import IP from "ip";

// set selected orgainsation in platform
router.post("/org", async (req, res) => {
    const merchantId = req.body.merchantId;
    const organizationId = req.body.organizationId;
    try {
        if (
            merchantId === undefined ||
            merchantId === null ||
            organizationId === undefined ||
            organizationId === null
        ) {
            throw new Error("Invalid Request");
        } else {
            const merchant: any = await getMerchant(merchantId);
            let platforms: any = merchant.platforms;

            if (platforms === null || platforms === undefined) {
                throw new Error("No Platforms found");
            }

            const platform: any = platforms[platformKeys.zoho];
            platform.selectedOrganizationId = organizationId;
            platforms[platformKeys.zoho] = platform;

            merchant.platforms = platforms;
            merchant.markModified("platforms");
            await merchant.save();

            logger.log({
                level: "info",
                message: `create Selected Organization Api, ip: ${IP.address()} merchantId: ${merchantId} 
        platformKey: ${platformKeys.zoho} organizationId: ${organizationId} URL: ${req.protocol
                    }://${req.get("host")}${req.originalUrl}`,
            });
            return res.send({ success: true, msg: "Merchant saved" });
        }
    } catch (error: any) {
        logger.log({
            level: "error",
            message: `create Selected Organization Api, ip: ${IP.address()} error: ${error.message
                } merchantId: ${merchantId} platformKey: ${platformKeys.zoho} organizationId: ${organizationId} URL: ${req.protocol
                }://${req.get("host")}${req.originalUrl}`,
        });
        return res.send({ success: false, msg: error.message });
    }
});

// Get merchant zoho organisations
router.get("/info", async (req, res) => {
    const merchantId = String(req.query.merchantId);
    try {
        if (merchantId === null || merchantId === undefined) {
            return res
                .status(401)
                .json({ success: false, message: "merchantId required" });
        }

        const merchant: any = await getMerchant(merchantId);
        if (!merchant) throw new Error(" Merchant not found");

        const platforms: any = merchant.platforms;
        if (platforms === null || platforms === undefined)
            throw new Error("No Platforms found");

        const organizations: { id: any; name: any; }[] = platforms[platformKeys.zoho].organizations;

        if (organizations === null || organizations === undefined)
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
            message: `Link portal: get Platform zoho organisations, ip: ${IP.address()} error: ${error.message
                } merchantId:${merchantId} URL: ${req.protocol}://${req.get("host")}${req.originalUrl
                }`,
        });
        return res.send({ success: false, message: error.message });
    }
});
module.exports = router;