import express from "express";
import cookieParser from "cookie-parser";
import * as core from "express-serve-static-core";
import cors from "cors";

export default function App(): core.Express {
  const app = express();

  app.use(cookieParser());

  // For Mail Templates
  app.engine("html", require("ejs").renderFile);
  app.set("view engine", "html");
  app.set("view engine", "ejs");

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const WEB_URL = process.env.WEB_URL || ("http://localhost:3000" as string);
  app.use(cors({ origin: WEB_URL, credentials: true }));

  app.use(require("./routes"));
  return app;
}
