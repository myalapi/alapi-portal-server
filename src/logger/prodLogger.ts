const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }: { level: any, message: any, timestamp: any }) => {
    return `${timestamp} ${level}: ${message}`;
});

export default function prodLogger() {
    return createLogger({
        level: 'debug',
        format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), myFormat),
        transports: [
            new transports.Console(),
        ]
    });
}