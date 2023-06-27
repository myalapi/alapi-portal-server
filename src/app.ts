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
  app.use(
    cors({
      origin: [
        "https://app.alapi.co",
        "https://link.alapi.co",
        "https://app.testalapi.co",
        "https://link.testalapi.co",
        "http://localhost:3000",
        "http://localhost:3001",
      ],
      credentials: true,
    })
  );
  app.use(require("./routes"));

  return app;
}
