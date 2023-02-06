import Router from "express";
import {
  genPassword,
  genRecoverToken,
  sendResetPasswordEmail,
} from "../../../utils/userUtils";
import { BinaryLike } from "crypto";
import { getUser, getUserByRecoverToken } from "../../../dal/user";

const userRouter = Router();

/*Api for sending Password
    Reset link to the user*/

userRouter.post("/", async (req, res) => {
  const email = req.body.email;
  try {
    const user: any = await getUser(email);

    if (!user || (!!user && !user.emailConfirmed)) {
      return res.send(200);
    }
    const recoverToken = genRecoverToken();
    await user.updateOne({ recoverToken });
    await sendResetPasswordEmail(recoverToken, email);
    return res.send(200);
  } catch (error) {
    console.log(error);
    return res.send(200);
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

    return res.json({
      success: true,
      msg: "Password Changed successfully",
    });
  } catch (error: any) {
    console.log(error);
    return res.send({ success: false, msg: error.message });
  }
});
module.exports = userRouter;
