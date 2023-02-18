import mongoose from "mongoose";
const Merchants = mongoose.model("Merchants");

export async function getMerchant(id: string) {
  return await Merchants.findOne({ id: id }).then((merchant) => {
    return merchant;
  });
}

export async function getMercants(ids: [number]) {
  return await Merchants.find({ _id: { $in: ids } });
}

export async function searchMerchants(search: string, ids: [string]) {
  return await Merchants.find({
    merchantName: { $regex: search, $options: "i" },
    _id: { $in: ids },
  });
}

export async function createMerchant(merchantName: string, userId: string) {
  const merchant: any = await Merchants.create({
    merchantName,
    userId: userId,
    createdOn: Date.now(),
  });
  merchant.link = process.env.LINK_URL + "invite/" + merchant.id;
  await merchant.save();
  return merchant;
}
