import dotenv from "dotenv";

import App from "./app";
import initializePlatforms from "./config/db.init";
import logger from "./logger/index";

dotenv.config();

import connectMongoose from "./config/database";


const PORT = process.env.SERVER_PORT || 8000;

connectMongoose(() => {
  initializePlatforms();
  let app = App();
  app.listen(PORT, function () {
    logger.log({
      level: "info",
      message: `listening on port ${PORT}: http://localhost:${PORT}}`,
    });
  });
  return App;
});
