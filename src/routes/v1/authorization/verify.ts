import Router from "express";
import { verifyJWT } from "../../../utils/jwtUtils";
import mongoose from "mongoose";
const User = mongoose.model("User");

const router = Router();

router.get("/:token", async (req, res) => {
  const token = req.params.token;

  try {
    const verify: any = verifyJWT(token);
    
   const result =  await User.updateOne(
      { _id: verify.sub },
      { $set: { emailConfirmed: true } }
    );    
    console.log(result);
    
    
    return res.redirect(`${process.env.WEB_URL}`);
  } catch (error) {
    console.log(error);
    return res.send("Url is invalid, PLease Try Again");
  }
});

module.exports = router;
