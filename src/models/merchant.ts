import mongoose from "mongoose";

const MerchantSchema = new mongoose.Schema({
  merchantId: Number,
  merchantName: String,
  userId: String,
  createdOn: Date,
  platforms: Object,
  link: String,
});

mongoose.model("Merchants", MerchantSchema, "merchants");
