import { createNewUser } from "../utils/userUtils";
import User from "../models/user";
import mongoose from "mongoose";

export async function getUser(id: string) {
  return await User.findOne({ _id: id }).then((user) => {
    return user;
  });
}

export async function getUserByRecoverToken(recoverToken: string) {
  return await User.findOne({ recoverToken: recoverToken }).then((user) => {
    return user;
  });
}

export async function getUserFromEmail(email: string) {
  return await User.findOne({ email: email }).then((user) => {
    return user;
  });
}

export async function createUser(
  email: String,
  password: string,
  companyName: String,
  name: String
) {
  const newUser: any = new User({
    ...createNewUser(email, password, companyName, name),
  });

  const user: any = await User.findOne({ email: email }).then((user) => {
    return user;
  });
  if (!user) {
    await newUser.save();
  } else if (!!user && !user.emailConfirmed) {
    await user.delete();
    await newUser.save();
  } else {
    throw new Error("Account already exists");
  }
  return newUser;
}

export async function updateUserConfirm(id: string) {
  const user: any = await User.findOne({
    _id: new mongoose.Types.ObjectId(id),
  });
  
  user.emailConfirmed = true;
  await user.save();
  return user;
}
