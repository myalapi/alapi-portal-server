import mongoose from "mongoose";

// const MerchPlatSchema = new mongoose.Schema({
//     id:String,
//     isEnabled: Boolean,
//     isWorking: Boolean,
//     credentials: Object

// });

const MerchantSchema = new mongoose.Schema({
  merchantId: Number,
  merchantName: String,
  userId: String,
  createdOn: Date,
  platforms: Object,
  link: String,
  lastSyncDate: Date,
});

mongoose.model("Merchants", MerchantSchema, "merchants");
