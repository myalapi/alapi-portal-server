import Router from "express";
import authMiddle from "../../../middlewares/authMiddle";
import mongoose from "mongoose";

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
      platforms: Object.keys(m.platforms),
    });
  }
  res.send({ companies: finalMerchs });
});

router.get("/search", authMiddle, async (req, res) => {
  const merchants = req.body.user.merchants;
  const query = req.query.search===undefined ? "":req.query.search;  
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
      platforms: Object.keys(m.platforms),
    });
  }
  res.send({ companies: merchs });
});

module.exports = router;
