import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { verifyJWT } from "../utils/jwtUtils";
const User = mongoose.model("User");

export default async function authMiddle(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  const Cookies = req.cookies;
  const jwt = Cookies.jwt;

  if (jwt === undefined || jwt === null) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  try {
    const token: any = verifyJWT(jwt);
    await User.findById(token.sub).then((user: any) => {
      req.body = {...req.body, auth: true, user: user};
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      auth: false,
      msg: "Token expired or invalid",
    });
  }
}
