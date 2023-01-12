import Router from "express";
import authMiddle from "../../../middlewares/authMiddle";
import mongoose from "mongoose";
import User from "../../../models/user";

const Merchants = mongoose.model("Merchants");


const router = Router();

router.get("/", authMiddle, async (req, res) => {
  const merchants = req.body.user.merchants;
  const merchs = await Merchants.find(
    { _id: { $in: merchants } },
    "merchantId merchantName platforms createdOn"
  );
  const finalMerchs = [];
  for (var i = 0; i < merchs.length; i++) {
    const m: any = merchs[i];
    finalMerchs.push({
      id: m.mechantId,
      name: m.merchantName,
      createdOn: m.createdOn,
      platforms: m.platforms ? Object.keys(m.platforms) : null,
    });
  }
  res.send({ companies: finalMerchs });
});

router.get("/search", authMiddle, async (req, res) => {
  const merchants = req.body.user.merchants;
  const query = req.query.search === undefined ? "" : req.query.search;
  const merchs = await Merchants.find(
    { merchantName: { $regex: query, $options: "i" }, _id: { $in: merchants } },
    "merchantId merchantName platforms createdOn"
  );
  const finalMerchs = [];
  for (var i = 0; i < merchs.length; i++) {
    const m: any = merchs[i];
    finalMerchs.push({
      id: m.mechantId,
      name: m.merchantName,
      createdOn: m.createdOn,
      platforms: m.platforms ? Object.keys(m.platforms) : null,
    });
  }
  res.send({ companies: merchs });
});

router.post("/create", authMiddle, async (req, res) => {
  try {
    const { merchantName } = req.body;

    if (typeof merchantName !== "string" || (merchantName.length === 0)) return res.status(401).json({ success: false, message: "Please provide a valid merchantName" });

    const merchant = await Merchants.create({
      merchantName,
      userId: req.body.user._id,
      createdOn: Date.now(),
    });

    const userId = req.body.user._id;
    const user = await User.findById(userId);
    console.log(user.merchants);
    user.merchants.push(merchant._id);
    await user.save();

    return res.status(201).json({
      success: true,
      merchant,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
})

module.exports = router;
