import TallyUser from "../models/tallyUser";

export async function getTallyUser(id: string) {
  return await TallyUser.findOne({ _id: id }).then((merchant) => {
    return merchant;
  });
}
export async function getTallyUserFromEmail(email: string) {
  return await TallyUser.findOne({ email: email }).then((tallyUser) => {
    return tallyUser;
  });
}

export async function getUserFromAccessToken(accessToken: string) {
  return await TallyUser.findOne({ accessToken: accessToken }).then(
    (tallyUser) => {
      return tallyUser;
    }
  );
}
export async function getTallyUserByRecoverToken(recoverToken: string) {
  return await TallyUser.findOne({ recoverToken: recoverToken }).then((user) => {
    return user;
  });
}


export async function updateTallyUserConfirm(id: string) {
  return await TallyUser.updateOne({ _id: id }, { $set: { isVerified: true } });
}


export async function deleteAccessToken(id: string) {
  return await TallyUser.updateOne(
    { _id: id },
    { $unset: { accessToken: "" } }
  );
}

export async function deleteTallyUser(id: string) {
  return await TallyUser.deleteOne({ _id: id });
}
