import Router from "express";
import {
  genPassword,
  genRecoverToken,
  sendResetPasswordEmail,
} from "../../../utils/userUtils";
import { BinaryLike } from "crypto";
import { getUserByRecoverToken, getUserFromEmail } from "../../../dal/user";
import logger from "../../../logger";
import IP from 'ip';

const userRouter = Router();

/*Api for sending Password
    Reset link to the user*/

userRouter.post("/", async (req, res) => {
  const email = req.body.email;
  try {
    const user: any = await getUserFromEmail(email);

    if (!user || (!!user && !user.emailConfirmed)) {
      throw new Error("User not found or not confirmed");
    }
    const recoverToken = genRecoverToken();
    await user.updateOne({ recoverToken });
    await sendResetPasswordEmail(recoverToken, email);
    logger.log({
      level: "info",
      message: `Password-Recovery API, ip: ${IP.address()} userId: ${user.id} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.sendStatus(200);
  } catch (error:any) {
    logger.log({
      level: "error",
      message: `Password-Recovery API, ip: ${IP.address()} error: ${error.message} email: ${email} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });

    console.log(error);
    return res.sendStatus(200);
  }
});

/*Api for Changing Password
    From reset link of the user*/
userRouter.post("/:recoverToken", async (req, res) => {
  const recoverToken = req.params.recoverToken;
  const {
    newPassword,
    confirmPassword,
  }: {
    newPassword: BinaryLike;
    confirmPassword: BinaryLike;
  } = req.body;
  try {
    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const user: any = await getUserByRecoverToken(recoverToken);
    if (!user) {
      throw new Error("Invalid Requested User");
    }
    const saltHash = genPassword(newPassword);
    await user.updateOne({
      $set: {
        salt: saltHash.salt,
        hash: saltHash.hash,
      },
      $unset: { recoverToken: "" },
    });
    logger.log({
      level: "info",
      message: `Change password using recovery Token API, ip: ${IP.address()} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.json({
      success: true,
      msg: "Password Changed successfully",
    });
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Change password using recovery Token API,ip: ${IP.address()} error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    });
    return res.send({ success: false, msg: error.message });
  }
});
module.exports = userRouter;
