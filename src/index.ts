import dotenv from "dotenv";
import cors from "cors";
import App from "./app";

dotenv.config();

require("./config/database");
require("./models/user");
require("./models/merchant");
require("./models/platform");

const PORT = process.env.SERVER_PORT || 8000;
// const WEB_URL = process.env.WEB_URL || "http://localhost:3000";

const app = App();

// var whitelist = [WEB_URL, "http://localhost:3001"];

app.use(cors({ origin: "*", credentials: true }));
app.use(require("./routes"));

app.listen(PORT, function () {
  console.log(`listening on port ${PORT}: http://localhost:${PORT}`);
});
