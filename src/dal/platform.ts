import mongoose from "mongoose";
const Platforms = mongoose.model("Platforms");

export async function getPlatform(id: string) {
  return await Platforms.findOne({ _id: id }).then((platform) => {
    return platform;
  });
}

export async function getPlatforms() {
  return await Platforms.find({}).then((platforms) => {
    return platforms;
  });
}

export async function getPlatformByKey(key: string) {
  return await Platforms.findOne({ platformKey: key }).then((platform) => {
    return platform;
  });
}