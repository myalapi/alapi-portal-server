import express from 'express';
import dotenv from 'dotenv';

const cors = require('cors');

dotenv.config()

require('./config/database');
require('./models/user');


const PORT = process.env.PORT || 3000;

const app = express();

// app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({origin:'http://localhost:8080', credentials:true}));

app.use(require('./routes'));

// app.get('/',(req, res) => {
//     let options = {
//         domain: 'localhost',
//         maxAge: 1000000 * 60 * 15, // would expire after 15 minutes
//         httpOnly: true, // The cookie only accessible by the web server
//          // Indicates if the cookie should be signed
//     }
//     res.status(200).cookie('cookieName', 'cookieValue', options)
//         .json({ success: true})
//     res.send("Working");
       
// })

app.listen(PORT, function () {
    console.log(`listening on port ${PORT}: http://localhost:${PORT}`);
});