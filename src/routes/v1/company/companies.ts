import Router from "express";
import authMiddle from "../../../middlewares/authMiddle";
import mongoose from "mongoose";

const Merchants = mongoose.model("Merchants");

const router = Router();

router.get("/",authMiddle, async (req, res) => {
    const merchants = req.body.user.merchants;
    const merchs= await Merchants.find({"id":{$in:merchants}}, 'merchantId merchantName platforms createdOn');
    const finalMerchs = [];
    for(var i=0; i<merchs.length; i++){
        const m:any = merchs[i];
        finalMerchs.push({id: m.mechantId, name:m.merchantName, createdOn:m.createdOn, platforms:Object.keys(m.platforms) });
    }
    console.log(finalMerchs);
    res.send(finalMerchs);
    
});

module.exports = router;