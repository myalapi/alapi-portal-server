import mongoose from "mongoose";
const CredentialSchema = new mongoose.Schema({
  name: String,
  type: String,
  value: String,
});

export interface IPlatform {
  platformKey: String;
  platformName: String;
  platformUrl: String;
  icon: String;
  type: String;
  credentials: Array<any>;
}
const PlatformSchema = new mongoose.Schema<IPlatform>({
  platformKey: { type: String, unique: true },
  platformName: String,
  platformUrl: String,
  icon: String,
  type: String,
  credentials: [CredentialSchema],
});

const Platform = mongoose.model("Platforms", PlatformSchema, "platforms");

export default Platform;
