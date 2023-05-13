
import devLogger from "./devLogger";
import prodLogger from "./prodLogger";

let logger: any = null;

const env = process.env.NODE_ENV;

if (env === 'production') {
    logger = prodLogger();
} else {
    logger = devLogger();
}

export default logger;