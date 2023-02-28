import Router from "express";
import logger from "../../../logger";
import authMiddle from "../../../middlewares/authMiddle";
const router = Router();
import IP from 'ip';


router.get("/", authMiddle, (req, res) => {
  const user = req.body.user;
  logger.log({
    level: "info",
    message: `Get merchant keys: clientId & clientSecret, ip: ${IP.address()} userId: ${user._id} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
  });
  res.json({success:true, clientId: user.clientId, clientSecret: user.clientSecret});
});

module.exports = router;
