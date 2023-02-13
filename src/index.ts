import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config()

require('./config/database');
require('./models/user');
require('./models/merchant');
require('./models/platform');


const PORT = process.env.SERVER_PORT || 8000;

const app = express();

app.use(cookieParser());


// For Mail Templates
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(require('./routes'));

app.listen(PORT, function () {
    console.log(`listening on port ${PORT}: http://localhost:${PORT}`);
});