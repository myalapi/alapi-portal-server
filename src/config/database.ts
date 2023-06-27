import mongoose, { ConnectOptions } from "mongoose";
import logger from "../logger";

require("dotenv").config();

const devConnection: string = process.env.DB_STRING as string;
const prodConnection: string = process.env.DB_STRING_PROD as string;

// Connect to the correct environment database
export default function connectMongo(callback: () => void) {
  if (process.env.NODE_ENV === "production") {
    mongoose.connect(prodConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 0,
    } as ConnectOptions);

    mongoose.connection.on("connected", () => {
      logger.log({
        level: "info",
        message: `Database connected`,
      });
      callback();
    });
  } else {
    mongoose.connect(devConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 0,
    } as ConnectOptions);

    mongoose.connection.on("connected", () => {
      logger.log({
        level: "info",
        message: `Database connected`,
      });
      callback();
    });
  }
}
