import dotenv from "dotenv";
import cors from "cors";
import App from "./app";
import initializePlatforms from "./config/db.init";

dotenv.config();

require("./config/database");
require("./models/user");
require("./models/merchant");
require("./models/platform");

initializePlatforms();

const PORT = process.env.SERVER_PORT || 8000;

const app = App();

app.use(
  cors({
    origin: ["https://app.alapi.co", "http://localhost:3001"],
    credentials: true,
  })
);
app.use(require("./routes"));

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}: http://localhost:${PORT}`);
});
