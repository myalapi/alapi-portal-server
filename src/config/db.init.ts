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
            icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Tally_-_Logo.png/1200px-Tally_-_Logo.png",
          },
        },
      },
    ]);
    console.log("Platforms Created Successfully");
  } catch (error) {
    console.log(error);
    console.log("Platforms Already Exists");
  }
  return res;
}
