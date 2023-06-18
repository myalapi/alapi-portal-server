import mongoose from "mongoose";

const MerchantSchema = new mongoose.Schema({
  merchantName: String,
  merchantEmail: String,
  userId: String,
  createdOn: Date,
  platforms: Object,
  link: String,
});

const Merchant = mongoose.model("Merchant", MerchantSchema, "merchants");
export default Merchant; 