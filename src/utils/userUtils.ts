import crypto, { BinaryLike } from "crypto";
import jwt, { VerifyOptions } from "jsonwebtoken";
import fs from "fs";
import path from "path";

const pathToPrivateKey = path.join(__dirname, "..", "keys", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToPrivateKey, "utf8");

const pathToPublicKey = path.join(__dirname, "..", "keys", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToPublicKey, "utf8");

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
export function issueJWT(userId: String) {
  const _id = userId;
  const expiresIn = "1d";

  const payload = {
    sub: _id,
    iat: Date.now(),
    // aud: aud,
    exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
  };

  const signedToken = jwt.sign(payload, PRIV_KEY, { algorithm: "RS256" });

  return {
    token: signedToken,
    expiresIn: expiresIn,
  };
}

export function verifyToken(token: string, _aud?: string | string[] | undefined) {
  try {
    jwt.verify(token, PUB_KEY, {
      algorithm: "RS256",
    } as VerifyOptions);
    // if (results.aud == aud) {
    //   return { ...results, status: true };
    // } else {
      return { status: false };
    // }
  } catch (error) {
    console.log(error);
    return { status: false };
  }
}

export function verifyTokenWithoutAud(token: string) {
  try {
    const results: any = jwt.verify(token, PUB_KEY, {
      algorithm: "RS256",
    } as VerifyOptions);
    return { ...results, status: true };
  } catch (error) {
    console.log(error);
    return { status: false };
  }
}
