import Router from "express";
// import mongoose from "mongoose";
import User from "../../../models/user";
import Merchants from "../../../models/merchant";

const router = Router();


router.post("/", async (req, res) => {
    try {
        const { userId, merchantName } = req.body;

        if (userId === null || userId === undefined || merchantName === null || merchantName === undefined) {
            return res.status(401).json({ success: false, msg: "Company Name or Name Required" });
        }
        if (typeof merchantName !== "string" || (merchantName.length === 0))
            return res.status(401).json({ success: false, message: "Please provide a valid merchantName" });

        const merchant = await Merchants.create({
            merchantName,
            userId: req.body.userId,
            createdOn: Date.now(),
        });
        const user = await User.findById(userId);
        user.merchants.push(merchant._id);
        await user.save();

        return res.status(201).json({
            success: true,
            merchant,
        });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }
})

module.exports = router;    