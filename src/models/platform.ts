import mongoose from "mongoose";
const CredentialSchema = new mongoose.Schema({
  name: String,
  type: String,
  value: String,
});

const PlatformSchema = new mongoose.Schema({
  platformKey: String,
  platformName: String,
  platformUrl: String,
  icon: String,
  type: String,
  credentials: [CredentialSchema],
});

const Platforms = mongoose.model("Platforms", PlatformSchema, "platforms");
export default Platforms;
