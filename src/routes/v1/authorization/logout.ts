import Router from "express";
import logger from "../../../logger";
import IP from 'ip';


const userRouter = Router();

userRouter.get("/", async (req, res) => {
  logger.log({
    level: "info",
    message: `Logout API, ip: ${IP.address()} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
  });
  res.cookie("jwt", "token").status(200).send("cleared");
});

module.exports = userRouter;
