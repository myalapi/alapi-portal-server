import { Console } from "console";
import prodLogger from "./prodLogger";

let logger: any = null;

const env = process.env.NODE_ENV;

if (env === 'development') {
    logger = prodLogger();
} else {
    logger = Console;
}

export default logger;