import dotenv from "dotenv";
import cors from "cors";
import App from "./app";
import initializePlatforms from "./config/db.init";
import IP from 'ip';

dotenv.config();

import logger from "./logger/index";


require("./config/database");
require("./models/user");
require("./models/merchant");
require("./models/platform");

initializePlatforms();

const PORT = process.env.SERVER_PORT || 8000;

const app = App();

app.use(
  cors({
    origin: ["https://app.alapi.co", "http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);
app.use(require("./routes"));

app.listen(PORT, function () {
  logger.log({
    level: "info",
    message: `listening on port ${PORT}: http://localhost:${PORT} ip: ${IP.address()}`
  });
});
