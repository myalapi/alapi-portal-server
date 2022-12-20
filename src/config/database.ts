import mongoose, { ConnectOptions } from 'mongoose';

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
        console.log('Database connected');
    });
} else {
    mongoose.connect(devConnection, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectOptions);

    mongoose.connection.on('connected', () => {
        console.log('Database connected');
    });
}

