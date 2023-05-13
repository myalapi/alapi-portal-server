import logger from "../logger";
import IP from 'ip';
import Platform from "../models/platform";

export default async function initializePlatforms() {
  let res;
  try {
    res = await Platform.bulkWrite([
      {
        insertOne: {
          document: {
            platformKey: "abde",
            platformName: "zoho",
            platformUrl: "zoho",
            credentials: [
              {
                name: "Client Id",
                type: "clientId",
              },
              {
                name: "Client Secret",
                type: "clientSecret",
              },
            ],
            type: "Accounting",
            icon: "https://cdn.iconscout.com/icon/free/png-256/zoho-282840.png",
          },
        },
      },
      {
        insertOne: {
          document: {
            platformKey: "abgf",
            platformName: "tally",
            platformUrl: "tally",
            type: "Accounting",
            icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Tally_-_Logo.png/1200px-Tally_-_Logo.png",
          },
        },
      },
    ]);
    logger.log({
      level: "info",
      message: `Platforms Initialisation: Platforms Created Successfully, ip: ${IP.address()}`
    });
  } catch (error: any) {
    if (error.name === "MongoBulkWriteError") {
      logger.log({
        level: "error",
        message: `Platforms Initialisation: Platforms Already Exists, ip: ${IP.address()}`
      });
    } else {
      logger.log({
        level: "error",
        message: `Platforms Initialisation, ip: ${IP.address()} error: ${error.message}`
      });
    }
  }
  return res;
}
