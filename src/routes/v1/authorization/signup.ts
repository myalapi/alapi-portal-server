import Router from "express";
import { createNewUser, sendVerifEmail } from "../../../utils/userUtils";
import { getIdPass } from "../../../utils/decodeUtils";

const userRouter = Router();
import mongoose from "mongoose";
const User = mongoose.model("User");

userRouter.get("/", function (_req, res) {
  res.send("No Get Request");
});

userRouter.post("/", async (req, res) => {
  const { email, password } = getIdPass(req.headers);
  const { companyName, name } = req.body;

  if (!companyName || !name) {
    return res.json({ success: false, msg: "Company Name or Name Required" });
  }

  const newUser = new User({
    ...createNewUser(email, password, companyName, name),
  });

  User.findOne({ email })
    .then(async (user: any) => {
      if (!user) {
        console.log("User not found");
        
        await newUser.save();
        await sendVerifEmail(newUser.id);
        return res.json({ success: true, msg: "Account Created successfully" });
      } else if (!!user && !user.emailConfirmed) {
        console.log("User found but not confirmed");        
        await user.delete();
        await newUser.save();
        await sendVerifEmail(newUser.id);
        return res.json({ success: true, msg: "Account Created successfully" });
      } else {
        console.log("User confirmed");

        return res.json({ success: false, msg: "Account already exists" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(401).json({ success: false, msg: "Could not connect" });
    });
    return;
});

module.exports = userRouter;
