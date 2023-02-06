import Router from "express";
import { sendVerifEmail } from "../../../utils/userUtils";
import { getIdPass } from "../../../utils/decodeUtils";

const userRouter = Router();
import { createUser } from "../../../dal/user";

userRouter.get("/", function (_req, res) {
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
    return res.json({ success: true, msg: "Account Created successfully" });
  } catch (error: any) {
    return res.json({
      success: false,
      msg: error.message,
    });
  }
});

module.exports = userRouter;
