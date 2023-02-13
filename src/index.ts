import dotenv from "dotenv";
import cors from "cors";
import App from "./app";

dotenv.config();

require("./config/database");
require("./models/user");
require("./models/merchant");
require("./models/platform");

const PORT = process.env.SERVER_PORT || 8000;
const WEB_URL = process.env.WEB_URL || "http://localhost:3000";


const app = App();

app.use(cors({ origin: WEB_URL, credentials: true }));

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}: http://localhost:${PORT}`);
});
