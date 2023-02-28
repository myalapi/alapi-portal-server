import Router from "express";
import logger from "../../../logger";
import authMiddle from "../../../middlewares/authMiddle";
import IP from 'ip';

const router = Router();

router.get("/", authMiddle, (req, res) => {
    const user = req.body.user;
    logger.log({
        level: "info",
        message: `Get user details: Merchants & Platforms array length API, ip: ${IP.address()} userId: ${user._id} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    res.status(200).json({
        success: true,
        merchants: user.merchants.length,
        platforms: user.platforms.length,
    });
});

module.exports = router;
