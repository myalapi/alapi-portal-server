import Router from "express";
import mongoose from "mongoose";
import { getIdPass } from "../../../utils/decodeUtils";
import { validPassword } from "../../../utils/userUtils";
import { issueJWT } from "../../../utils/jwtUtils";

const User = mongoose.model("User");

const userRouter = Router();

userRouter.get("/", (_req: any, res) => {
  res.send("No GET Login Request");
});

userRouter.post("/", async (req, res) => {
  const { email, password } = getIdPass(req.headers);
  User.findOne({ email: email })
    .then(async (user: any) => {
      //   if (!user.emailConfirmed) {
      //    throw new Error("Email is not confirmed");
      //   }
      const isValid = validPassword(password, user.hash, user.salt);

      if (isValid) {
        const tokenObject = issueJWT(user._id);
        let options: any = {
          sameSite: "None",
          secure: true,
          maxAge: 1000000 * 60 * 15, // would expire after 15 minutes
          httpOnly: true, // The cookie only accessible by the web server
          // Indicates if the cookie should be signed
        };
        res
          .cookie("jwt", tokenObject.token, options)
          .status(200)
          .json({
            success: true,
            user: { name: user.name, email: user.email, companyName: user.companyName},
          });
      } else {
        throw new Error("Invalid Password");
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ success: false, msg: err.message });
    });
});

module.exports = userRouter;
