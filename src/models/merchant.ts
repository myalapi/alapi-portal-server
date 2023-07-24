import mongoose from "mongoose";
enum exportStatusEnum {
  In_Progress = "In Progress",
  Completed = "Completed",
  Error = "Error"
}
const ExportSchema = new mongoose.Schema({
  date: Date,
  status: { type: String, enum: exportStatusEnum },
});

const MerchantSchema = new mongoose.Schema({
  merchantName: String,
  merchantEmail: String,
  userId: String,
  createdOn: Date,
  exportDate: Date,
  export: ExportSchema,
  platforms: Object,
  link: String,
});

const Merchant = mongoose.model("Merchants", MerchantSchema, "merchants");
export default Merchant;
