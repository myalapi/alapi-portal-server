import Router from "express";
import authMiddle from "../../../middlewares/authMiddle";
import {
  createMerchant,
  getMerchants,
  getMerchant,
  searchMerchants,
} from "../../../dal/merchant";
import logger from "../../../logger";
import IP from "ip";

const router = Router();

//Get all the merchants from user
router.get("/", authMiddle, async (req, res) => {
  const merchants = req.body.user.merchants;
  try {
    const merchs = await getMerchants(merchants);
    const finalMerchs = [];
    for (var i = 0; i < merchs.length; i++) {
      const m: any = merchs[i];
      finalMerchs.push({
        id: m.mechantId,
        name: m.merchantName,
        createdOn: m.createdOn,
        platforms: m.platforms ? Object.keys(m.platforms) : null,
        link: m.link,
      });
    }
    logger.log({
      level: "info",
      message: `Get all merchants API, ip: ${IP.address()} userId: ${
        req.body.user._id
      } URL: ${req.protocol}://${req.get("host")}${req.originalUrl}`,
    });
    res.send({ companies: finalMerchs });
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Get all merchants API, ip: ${IP.address()} error: ${
        error.message
      } userId: ${req.body.user._id} URL: ${req.protocol}://${req.get("host")}${
        req.originalUrl
      }`,
    });
    res.send({ success: false, error: error });
  }
});

router.get("/search", authMiddle, async (req, res) => {
  const merchants = req.body.user.merchants;
  const query: string =
    req.query.search === undefined ? "" : (req.query.search as string);
  try {
    const merchs = await searchMerchants(query, merchants);
    const finalMerchs = [];
    for (var i = 0; i < merchs.length; i++) {
      const m: any = merchs[i];
      finalMerchs.push({
        id: m.mechantId,
        name: m.merchantName,
        createdOn: m.createdOn,
        platforms: m.platforms ? Object.keys(m.platforms) : null,
        link: m.link,
      });
    }
    logger.log({
      level: "info",
      message: `Merchants search API, ip: ${IP.address()} userId: ${
        req.body.user._id
      } URL: ${req.protocol}://${req.get("host")}${req.originalUrl}`,
    });
    res.send({ companies: merchs });
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Merchants search API, ip: ${IP.address()} error: ${
        error.message
      } userId: ${req.body.user._id} URL: ${req.protocol}://${req.get("host")}${
        req.originalUrl
      }`,
    });
    res.send({ success: false, error: error });
  }
});

router.post("/create", authMiddle, async (req, res) => {
  let { merchantName } = req.body;
  let merchantEmail = req.body.merchantEmail.toLowerCase();
  let user = req.body.user;
  try {
    if (typeof merchantName !== "string" || merchantName.length === 0)
      return res.status(401).json({
        success: false,
        message: "Please provide a valid merchantName",
      });
    if (typeof merchantEmail !== "string" || merchantEmail.length === 0)
      return res.status(401).json({
        success: false,
        message: "Please provide a valid merchantEmail",
      });

    const merchant = await createMerchant(
      merchantName,
      merchantEmail,
      user._id
    );

    user.merchants.push(merchant._id);
    await user.save();

    logger.log({
      level: "info",
      message: `Create merchant API, ip: ${IP.address()} userId: ${
        user._id
      } merchantId: ${merchant._id} URL: ${req.protocol}://${req.get("host")}${
        req.originalUrl
      }`,
    });
    return res.status(201).json({
      success: true,
      merchant,
    });
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Create merchant API, ip: ${IP.address()} error: ${
        error.message
      } userId: ${user._id} URL: ${req.protocol}://${req.get("host")}${
        req.originalUrl
      }`,
    });
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

//Get single merchant from merchantId
router.get("/:merchantId", authMiddle, async (req, res) => {
  const merchantId = req.params.merchantId;
  try {
    if (
      merchantId === undefined ||
      merchantId === null
    ) {
      throw new Error(`Invalid Merchant ID`);
    }
    const merchant: any = await getMerchant(merchantId);
    if (!merchant) {
      throw new Error(`No Merchant found for ${merchantId}`);
    }
    logger.log({
    level: "info",
    message: `Get merchant API, ip: ${IP.address()} userId: ${
      req.body.user._id
    } merchantId: ${merchantId} URL: ${req.protocol}://${req.get(
      "host"
    )}${req.originalUrl}`,
  });
    res.send({ merchant: merchant });
  } catch (err: any) {
    logger.log({
      level: "error",
      message: `Merchant middleware, ip: ${IP.address()} error: ${err.message} userId: ${req.body.user._id} merchantId: ${merchantId} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    res.send({ success: false, error: err })
  }
});

router.delete("/:companyId", authMiddle, async (req, res) => {
  const companyId = req.params.companyId;
  const user: any = req.body.user;
  try {
    if (companyId === undefined || companyId === null) {
      throw new Error("CompanyId not found");
    }
    const company = await getMerchant(companyId);
    if (company === null) {
      throw new Error("Company not found");
    }
    await company.remove();

    const merchantArray = user.merchants;
    const index = merchantArray.indexOf(companyId);
    merchantArray.splice(index, 1);
    user.merchants = merchantArray;
    await user.save();
    logger.log({
      level: "info",
      message: `Delete merchant API, ip: ${IP.address()} userId: ${
        user._id
      } URL: ${req.protocol}://${req.get("host")}${req.originalUrl}`,
    });
    return res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Delete merchant API, ip: ${IP.address()} error: ${
        error.message
      } userId: ${user._id} merchantId: ${companyId} URL: ${
        req.protocol
      }://${req.get("host")}${req.originalUrl}`,
    });
    return res.send(error.message);
  }
});

module.exports = router;
