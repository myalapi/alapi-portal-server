import dotenv from "dotenv";
import App from "./app";

dotenv.config();

require("./config/database");
require("./models/user");
require("./models/merchant");
require("./models/platform");

const PORT = process.env.SERVER_PORT || 8000;


const app = App();


app.listen(PORT, function () {
  console.log(`listening on port ${PORT}: http://localhost:${PORT}`);
});
