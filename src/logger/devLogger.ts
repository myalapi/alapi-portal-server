import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;
require("dotenv").config();
import "winston-mongodb";

const myFormat = printf((info) => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

export default function prodLogger() {
  return createLogger({
    level: "debug",
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), myFormat),
    transports: [
      new transports.Console(),
      new transports.MongoDB({
        db: process.env.DB_STRING as string,
        level: "debug",
        options: { useUnifiedTopology: true, socketTimeoutMS: 0,
          connectTimeoutMS: 0 },
        collection: "serverLogs",
      }),
    ],
  });
}
