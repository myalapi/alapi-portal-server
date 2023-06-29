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
      new transports.File({
        filename: "logs/server/serverLogs.log",
        maxsize: 102400,
      }),
      new transports.MongoDB({
        level: "debug",
        db: process.env.DB_STRING_PROD as string,
        options: {
          useUnifiedTopology: true,
          useNewUrlParser: true,
          socketTimeoutMS: 0,
          connectTimeoutMS: 0,
        },
        collection: "serverLogs",
      }),
    ],
  });
}
