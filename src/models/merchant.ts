import mongoose from "mongoose";

const MerchantSchema = new mongoose.Schema({
  merchantId: Number,
  merchantName: String,
  userId: String,
  createdOn: Date,
  platforms: Object,
  link: String,
});

const Merchant = mongoose.model("Merchant", MerchantSchema, "merchants");
export default Merchant; 