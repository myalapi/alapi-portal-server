import { Console } from "console";
import prodLogger from "./prodLogger";

let logger;

const env = process.env.NODE_ENV;

if(env === 'production') {
    logger = prodLogger();
}else{
    logger = Console;
}