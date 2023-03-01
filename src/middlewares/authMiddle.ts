import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import logger from "../logger";
import IP from 'ip';

import { verifyJWT } from "../utils/jwtUtils";
const User = mongoose.model("Users");

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
  } catch (error:any) {
    logger.log({
      level: "error",
      message: `authMiddleware, ip: ${IP.address()} error: ${error.message}`
    });
    res.status(401).json({
      success: false,
      auth: false,
      msg: "Token expired or invalid",
    });
  }
}
