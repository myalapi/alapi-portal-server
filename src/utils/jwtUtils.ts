import jwt, { VerifyOptions } from "jsonwebtoken";
import fs from "fs";
import path from "path";

const pathToPrivateKey = path.join(__dirname, "..", "keys", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToPrivateKey, "utf8");

const pathToPublicKey = path.join(__dirname, "..", "keys", "id_rsa_pub.pem");
const PUB_KEY = fs.readFileSync(pathToPublicKey, "utf8");

export function issueJWT(userId: String) {
  const _id = userId;
  const expiresIn = "1d";

  const payload = {
    sub: _id,
    iat: Date.now(),
    exp: Math.floor(Date.now() / 1000) + 2 * 60 * 60,
  };

  const signedToken = jwt.sign(payload, PRIV_KEY, { algorithm: "RS256" });

  return {
    token: signedToken,
    expiresIn: expiresIn,
  };
}

export function verifyJWT(token: string) {
  return jwt.verify(token, PUB_KEY, {
    algorithm: "RS256",
  } as VerifyOptions);
}
