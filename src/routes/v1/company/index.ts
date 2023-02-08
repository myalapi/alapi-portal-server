import Router from "express";
import authMiddle from "../../../middlewares/authMiddle";
import mongoose from "mongoose";

const Merchants = mongoose.model("Merchants");
const User = mongoose.model("User");

const router = Router();


//Get all the merchants from user
router.get("/", authMiddle, async (req, res) => {
  const merchants = req.body.user.merchants;
  try {
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
  } catch (error) {
    console.log(error);

    res.send({ success: false, error: error });
  }
});

router.get("/search", authMiddle, async (req, res) => {
  const merchants = req.body.user.merchants;
  const query = req.query.search === undefined ? "" : req.query.search;
  try {
    const merchs = await Merchants.find(
      {
        merchantName: { $regex: query, $options: "i" },
        _id: { $in: merchants },
      },
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
  } catch (error) {
    console.log(error);
    res.send({ success: false, error: error });
  }
});

router.post("/create", authMiddle, async (req, res) => {
  try {
    const { merchantName } = req.body;

    if (typeof merchantName !== "string" || merchantName.length === 0)
      return res
        .status(401)
        .json({
          success: false,
          message: "Please provide a valid merchantName",
        });

    const merchant = await Merchants.create({
      merchantName,
      userId: req.body.user._id,
      createdOn: Date.now(),
    });

    const userId = req.body.user._id;
    const user: any = await User.findById(userId);
    user.merchants.push(merchant._id);
    await user.save();

    return res.status(201).json({
      success: true,
      merchant,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

router.delete("/:companyId", authMiddle, async (req, res) => {
  const companyId = req.params.companyId;
  const user: any = req.body.user;// user platforms array se company id delete karni h
  try {
    if (companyId === undefined || companyId === null) {
      throw new Error("CompanyId not found");
    }
    const company = await Merchants.findById(companyId);
    if (company === null) {
      throw new Error("Company not found");
    }
    await company.remove();

    const merchantArray = user.merchants;
    const index = merchantArray.indexOf(companyId);
    merchantArray.splice(index, 1);
    user.merchants=merchantArray;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Company deleted successfully"
    })
  } catch (error: any) {
    console.log(error);
    return res.sendStatus(error.message);
  }

});


module.exports = router;
