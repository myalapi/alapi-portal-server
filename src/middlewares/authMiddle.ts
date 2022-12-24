import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { verifyTokenWithoutAud } from "../utils/userUtils";
const User = mongoose.model("User");

export default async function authMiddle(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const Cookies = req.cookies;
  const jwt = Cookies.jwt;
  const status = verifyTokenWithoutAud(jwt);

  if (!!jwt && status.status) {
    await User.findById(status.sub).then((user: any) => {
      if (user.token === jwt) {
        console.log("Token verified");
        req.body ={authProp: { auth: true, user: user }};
        next();
      } else {
        console.log("token expired or invalid");
        res.status(401).json({success:false, auth: false, msg: "Token expired or invalid" });
      }
    });
  } else {
    console.log("not verified");
    res.status(401).json({success: false, auth: false, msg: "Token not verified" });
  }
}
