import Router from "express";
import authMiddle from "../../../middlewares/authMiddle";
const router = Router();

router.get("/", authMiddle, (req, res) => {
  const authProp = req.body.authProp;
  const user = authProp.user;
  res.json({success:true, clientId: user.clientId, clientSecret: user.clientSecret});
});

module.exports = router;
