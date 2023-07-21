import mongoose from "mongoose";
const TallyUserSchema = new mongoose.Schema(
  {
    email: String,
    salt: String,
    hash: String,
    name: String,
    merchantId: { type: mongoose.Types.ObjectId },
    businessGuid: String,
    expiryDate: Date,
    accessToken: String,
    companies: Array,
    recoverToken: String,
    currency: String,
    isVerified: Boolean,
    status: { type: String, enum: ["new", "uploaded", "synced"] },
    lastSync: Date,
  },
  {
    strictQuery: false,
  }
);

const TallyUser = mongoose.model("TallyUser", TallyUserSchema, "tallyUsers");
export default TallyUser;