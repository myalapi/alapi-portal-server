import Merchant from "../models/merchant";
import mongoose from "mongoose";

export async function getMerchant(id: string) {
  if(!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid Merchant ID");
  }
  return await Merchant.findOne({ _id: id }).then((merchant) => {
    return merchant;
  });
}

export async function getMerchants(ids: [number]) {
  return await Merchant.find({ _id: { $in: ids } });
}

export async function searchMerchants(search: string, ids: [string]) {
  return await Merchant.find({
    $and: [
      {
        $or: [
          { merchantName: { $regex: search, $options: "i" } },
          { merchantEmail: { $regex: search, $options: "i" } },
        ],
      },
      {
        _id: { $in: ids },
      },
    ],
  });
}

export async function createMerchant(
  merchantName: string,
  merchantEmail: string,
  userId: string
) {
  const merchant: any = await Merchant.create({
    merchantName,
    merchantEmail,
    userId: userId,
    createdOn: Date.now(),
  });
  merchant.link = process.env.LINK_URL + "/connect/" + merchant.id;
  await merchant.save();
  return merchant;
}
