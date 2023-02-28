import Router from "express";
import { sendVerifEmail } from "../../../utils/userUtils";
import { getIdPass } from "../../../utils/decodeUtils";

const userRouter = Router();
import { createUser } from "../../../dal/user";
import logger from "../../../logger";
import IP from 'ip';


userRouter.get("/", function (req, res) {
  logger.log({
    level: "warn",
    message: `Invalid GET request, ip: ${IP.address()} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
  });
  res.send("No Get Request");
});

userRouter.post("/", async (req, res) => {
  const { email, password } = getIdPass(req.headers);
  const { companyName, name } = req.body;
  try {
    if (!companyName || !name) {
      return res.json({ success: false, msg: "Company Name or Name Required" });
    }
    const user = await createUser(email, password, companyName, name);
    await sendVerifEmail(user.id, user.email);
    logger.log({
      level: "info",
      message: `SignUp API called, ip: ${IP.address()} userId: ${user.id} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.json({ success: true, msg: "Account Created successfully" });
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `SignUp API called, ip: ${IP.address()} error: ${error.message} email: ${email} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.json({
      success: false,
      msg: error.message,
    });
  }
});

module.exports = userRouter;
