import Router from "express";
import { getIdPass } from "../../../utils/decodeUtils";
import { validPassword } from "../../../utils/userUtils";
import { issueJWT, jwtOptions } from "../../../utils/jwtUtils";
import { getUserFromEmail } from "../../../dal/user";

const userRouter = Router();

userRouter.get("/", (_req: any, res) => {
  res.send("No GET Login Request");
});

userRouter.post("/", async (req, res) => {
  const { email, password } = getIdPass(req.headers);
  try {
    const user: any = await getUserFromEmail(email);
    if (!user) throw new Error("User not found");
    if (!user.emailConfirmed) throw new Error("Email is not confirmed");
    const isValid = validPassword(password, user.hash, user.salt);
    if (!isValid) throw new Error("Invalid password");
    const token = issueJWT(user._id);

    const userData = {
      name: user.name,
      email: user.email,
      companyName: user.companyName,
      userId: user._id,
    };
    return res.cookie("jwt", token, jwtOptions).status(200).json({
      success: true,
      user: userData,
    });
  } catch (error: any) {
    console.log(error);
    return res.json({ success: false, msg: error.message });
  }
});

module.exports = userRouter;
