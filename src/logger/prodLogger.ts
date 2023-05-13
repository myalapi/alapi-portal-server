import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;

const myFormat = printf((info) => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

export default function prodLogger() {
  return createLogger({
    level: "debug",
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), myFormat),
    transports: [
      new transports.File({ filename: "logs/serverLogs.log", maxsize: 1024 }),
    ],
  });
}
