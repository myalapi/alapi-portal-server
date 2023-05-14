import mongoose from "mongoose";

const Platform = new mongoose.Schema({
  platformKey: String,
  awsSecretName: String,
  isEnabled: Boolean,
  isConfigured: Boolean,
});

export interface IUser {
  email: String;
  name: String;
  companyName: String;
  salt: String;
  hash: String;
  emailConfirmed: Boolean;
  phoneConfirmed: Boolean;
  clientId: String;
  clientSecret: String;
  platforms: [];
  merchants: [];
  recoverToken: String;
}
const UserSchema = new mongoose.Schema<IUser>({
  email: String,
  name: String,
  companyName: String,
  salt: String,
  hash: String,
  emailConfirmed: Boolean,
  phoneConfirmed: Boolean,
  clientId: String,
  clientSecret: String,
  platforms: [Platform],
  merchants: Array,
  recoverToken: String,
});

const User = mongoose.model("User", UserSchema, "users");
export default User; 