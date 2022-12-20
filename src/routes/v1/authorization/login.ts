import Router from "express";
import mongoose from "mongoose";
import { getIdPass } from "../../../utils/decodeUtils";
import { issueJWT, validPassword } from "../../../utils/userUtils";

const User = mongoose.model("User");

const userRouter = Router();

userRouter.get("/", (_req: any, res) => {
  res.send("No GET Login Request");
});

userRouter.post("/", async (req, res) => {
  const { email, password } = getIdPass(req.headers);
  User.findOne({ email: email })
    .then(async (user: any) => {
      if (!user) {
        res.json({ success: false, msg: "e2" });
        return;
        // e2=InvalidEmail
      }
    //   if (!!user && !user.emailConfirmed) {
    //     res.json({ success: false, msg: "e3" });
    //     return;
    //     // e3=UnconfirmedEmail
    //   }

      // Function defined at bottom of app.js
      const isValid = validPassword(password, user.hash, user.salt);

      if (isValid) {
        const tokenObject = issueJWT(user);
        let options: any = {
          sameSite: "None",
          secure: true,
          maxAge: 1000000 * 60 * 15, // would expire after 15 minutes
          httpOnly: true, // The cookie only accessible by the web server
          // Indicates if the cookie should be signed
        };
        await User.updateOne(
          { _id: user._id },
          { $set: { token: tokenObject.token, expiresIn: tokenObject.expiresIn } }
        )
          .then(() => {
            res
              .cookie("jwt", tokenObject.token, options)
              .status(200)
              .json({
                success: true,
                user: { name: user.name, email: user.email },
              });
          })
          .catch((err) => {
            console.log(err);

            res.sendStatus(500);
          });
      } else {
        res.json({ success: false, msg: "e1" });
        // e1=invalidpassword;
      }
    })
    .catch((err) => {
      console.log(err);
      return res.json({ success: false, msg: "e2" });
    });
});

module.exports = userRouter;
