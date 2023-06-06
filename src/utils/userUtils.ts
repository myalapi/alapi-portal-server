import crypto, { BinaryLike } from "crypto";
import { issueJWT } from "./jwtUtils";
import { mailOptions } from "./mail";
import ejs from "ejs";
import path from "path";
import { sendZeptoMail } from "./zeptomail";

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

export async function sendVerifEmail(userId: any, email: String) {
  const emailjwt = issueJWT(userId);
  const url = `${process.env.SERVER_URL}/authorize/verify/${emailjwt}`;
  const data = await ejs.renderFile(
    path.join(__dirname, "../", "views/verifyEmail/index.ejs"),
    { verifyLink: url }
  );
  const mailOption = mailOptions(
    "support@alapi.co",
    email,
    "Account Verification",
    "",
    { "x-myheader": "test header" },
    data
  );
  await sendZeptoMail(mailOption);
}

export async function sendResetPasswordEmail(
  recoverToken: string,
  email: String
) {
  const url = `${process.env.WEB_URL}/recover/${recoverToken}`;
  const data = await ejs.renderFile(
    path.join(__dirname, "../", "views/resetEmail/index.ejs"),
    { resetLink: url }
  );
  const mailOption = mailOptions(
    'support@alapi.co',
    email,
    "Password Reset Email",
    "",
    { "x-myheader": "test header" },
    data
  );
  await sendZeptoMail(mailOption);
}
