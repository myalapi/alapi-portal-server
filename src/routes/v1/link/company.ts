import { IUser } from "../../../models/user";
import Router from "express";
import logger from "../../../logger";
import IP from "ip";
import { getUser } from "../../../dal/user";
import { createMerchant } from "../../../dal/merchant";

const router = Router();

router.post("/", async (req, res) => {
  const { userId, merchantName } = req.body;
  const merchantEmail = req.body.merchantEmail.toLowerCase();

  try {
    if (
      userId === null ||
      userId === undefined ||
      merchantName === null ||
      merchantName === undefined
    ) {
      return res
        .status(401)
        .json({ success: false, msg: "Company Name or Name Required" });
    }
    if (typeof merchantName !== "string" || merchantName.length === 0)
      return res.status(401).json({
        success: false,
        message: "Please provide a valid merchantName",
      });

    const merchant = await createMerchant(merchantName, merchantEmail, req.body.userId);
    const user: IUser | any = await getUser(userId);
    user.merchants.push(merchant._id);
    await user.save();
    logger.log({
      level: "info",
      message: `Link portal: Create merchant API, ip: ${IP.address()} userId: ${userId} URL: ${
        req.protocol
      }://${req.get("host")}${req.originalUrl}`,
    });
    return res.status(201).json({
      success: true,
      merchant,
    });
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Link portal: Create merchant API, ip: ${IP.address()} error: ${
        error.message
      } userId: ${userId} URL: ${req.protocol}://${req.get("host")}${
        req.originalUrl
      }`,
    });
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
