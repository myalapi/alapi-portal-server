import mongoose from "mongoose";
import { createNewUser } from "../utils/userUtils";
const Users = mongoose.model("Users");

export async function getUser(id: string) {
  return await Users.findOne({ id: id }).then((user) => {
    return user;
  });
}


export async function getUserByRecoverToken(recoverToken: string) {
  return await Users.findOne({ recoverToken: recoverToken }).then((user) => {
    return user;
  });
}

export async function getUserFromEmail(email: string) {
  return await Users.findOne({ email: email }).then((user) => {
    return user;
  });
}

export async function createUser(
  email: String,
  password: string,
  companyName: String,
  name: String
) {
  const newUser: any = new Users({
    ...createNewUser(email, password, companyName, name),
  });

  const user: any = await Users.findOne({ email: email }).then((user) => {
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
  return await Users.updateOne({ _id: id }, { $set: { emailConfirmed: true } });
}
