import Router from "express";
import logger from "../../../logger";
import IP from 'ip';
import { jwtOptions } from "../../../utils/jwtUtils";


const userRouter = Router();

userRouter.get("/", async (req, res) => {
  logger.log({
    level: "info",
    message: `Logout API, ip: ${IP.address()} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
  });
  res.cookie("jwt", "token", jwtOptions).status(200).send("cleared");
});

module.exports = userRouter;
