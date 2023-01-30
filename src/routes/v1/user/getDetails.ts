import Router from "express";
import authMiddle from "../../../middlewares/authMiddle";

const router = Router();

router.get("/", authMiddle, (req, res) => {
    const user = req.body.user;
    res.status(200).json({
        success: true,
        merchants: user.merchants.length,
        platforms: user.platforms.length,
    });
});

module.exports = router;
