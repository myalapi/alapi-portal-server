import Router from "express";
import logger from "../../../logger";
import authMiddle from "../../../middlewares/authMiddle";
import IP from 'ip';

const userRouter = Router();

userRouter.get("/", authMiddle, async (req, res) => {
  const user = req.body.user;
  logger.log({
    level: "info",
    message: `IsLogin API, ip: ${IP.address()} userId: ${user._id} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
  });
  res.status(200).json({
    success: true,
    auth: true,
    user: {
      name: user.name,
      email: user.email,
      companyName: user.companyName,
      userId: user._id,
    },
  });
});

module.exports = userRouter;
