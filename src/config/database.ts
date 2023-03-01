import mongoose, { ConnectOptions } from 'mongoose';
import logger from '../logger';
import IP from 'ip';


require('dotenv').config();


const devConnection: string = process.env.DB_STRING as string;
const prodConnection: string = process.env.DB_STRING_PROD as string;

// Connect to the correct environment database
if (process.env.NODE_ENV === 'production') {
    mongoose.connect(prodConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions);

    mongoose.connection.on('connected', () => {
        logger.log({
            level: "info",
            message: `Database connected, ip: ${IP.address()}`
        });
    });
} else {
    mongoose.connect(devConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions);

    mongoose.connection.on('connected', () => {
        logger.log({
            level: "info",
            message: `Database connected, ip: ${IP.address()}`
        });
    });
}

