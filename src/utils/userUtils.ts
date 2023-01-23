import crypto, { BinaryLike } from "crypto";
import { issueJWT } from "./jwtUtils";
import { mail, mailOptions } from "./mail";

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

export function genRecoverToken() {
  return crypto.randomBytes(32).toString("hex");
}

export async function sendVerifEmail(userId: any, email:String) {
  const emailjwt = issueJWT(userId);
  const url = `${process.env.URL}/authorize/verify/${emailjwt}`;
  const mailOption = mailOptions(
    '"Alapi" support@alapi.co',
    email,
    "Hello world?",
    "url",
    { "x-myheader": "test header" },
    `<div>Hello world?
    <a href=${url}>Button</a></div>`
  );
  await mail(mailOption);
}

export async function sendResetPasswordEmail(recoverToken: string, email:String) {
  const url = `${process.env.WEB_URL}/recover/${recoverToken}`;
  console.log(url);
  
  const mailOption = mailOptions(
    '"Alapi" support@alapi.co',
    email,
    "Hello world?",
    "url",
    { "x-myheader": "test header" },
    `<div>Hello world?
    <a href=${url}>Button</a></div>`
  );
  await mail(mailOption);
}
