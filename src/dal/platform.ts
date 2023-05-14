import Platform from "../models/platform";

export async function getPlatform(id: string) {
  return await Platform.findOne({ _id: id }).then((platform) => {
    return platform;
  });
}

export async function getPlatforms() {
  return await Platform.find({}).then((platforms) => {
    return platforms;
  });
}

export async function getPlatformByKey(key: string) {
  return await Platform.findOne({ platformKey: key }).then((platform) => {
    return platform;
  });
}