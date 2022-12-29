import Router from "express";
import authMiddle from "../../../middlewares/authMiddle";
const router = Router();

router.get("/", authMiddle, (req, res) => {
  const user = req.body.user;
  res.json({success:true, clientId: user.clientId, clientSecret: user.clientSecret});
});

module.exports = router;
