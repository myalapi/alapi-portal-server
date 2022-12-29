import crypto, { BinaryLike } from "crypto";


export function validPassword(
  password: BinaryLike,
  hash: String,
  salt: BinaryLike
) {
  var hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

export function createNewUser(
  email: String,
  password: BinaryLike,
  companyName: String,
  name: String
) {
  const saltHash = genPassword(password);
  const { clientId, clientSecret }: { clientId: String; clientSecret: String } =
    genClientKeys();

  const userObj = {
    name: name,
    email: email,
    companyName: companyName,
    salt: saltHash.salt,
    hash: saltHash.hash,
    emailConfirmed: false,
    phoneConfirmed: false,
    clientId: clientId,
    clientSecret: clientSecret,
  };
  return userObj;
}

export function genPassword(password: BinaryLike) {
  var salt = crypto.randomBytes(32).toString("hex");
  var genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return {
    salt: salt,
    hash: genHash,
  };
}

export function genClientKeys() {
  var clientId: String = crypto.randomBytes(12).toString("hex");
  var clientSecret: String = crypto.randomBytes(12).toString("hex");
  return {
    clientId: clientId,
    clientSecret: clientSecret,
  };
}
