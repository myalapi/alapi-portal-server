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
  credentials: [];
}
const PlatformSchema = new mongoose.Schema<IPlatform>({
  platformKey: String,
  platformName: String,
  platformUrl: String,
  icon: String,
  type: String,
  credentials: [CredentialSchema],
});

mongoose.model("Platforms", PlatformSchema, "platforms");
