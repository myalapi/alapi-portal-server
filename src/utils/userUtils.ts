import crypto, { BinaryLike } from 'crypto';
import jwt, { VerifyOptions } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const pathToPrivateKey = path.join(__dirname, '..', 'keys', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToPrivateKey, 'utf8');

const pathToPublicKey = path.join(__dirname, '..', 'keys', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToPublicKey, 'utf8');


export function validPassword(password:BinaryLike, hash:String, salt:BinaryLike) {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

export function createNewUser(email:String, password:BinaryLike, companyName:String) {
  const saltHash = genPassword(password);
  const apiHash = genAPIKey();
  const link = genLink();

  const userObj = {
    email: email,
    companyName: companyName,
    salt: saltHash.salt,
    hash: saltHash.hash,
    emailConfirmed: false,
    phoneConfirmed: false,
    apiKey: apiHash.apiKey,
    link : link.link
  }
  return userObj;
}

export function genPassword(password:BinaryLike) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  return {
    salt: salt,
    hash: genHash
  };
}

export function genAPIKey(){
  
  var apiKey = crypto.randomBytes(12).toString('hex');
  // var prefix = apiKey.substring(6);
  // var apiSalt =crypto.randomBytes(32).toString('hex');
  // var genApiHash = crypto.pbkdf2Sync(apiKey, salt, 10000, 32, 'sha512').toString('hex');
  return {
    // apiSalt: apiSalt,
    // genApiHash: genApiHash,
    // prefix: prefix,
    apiKey: apiKey,
  }

}
export function genLink(){
  var link = crypto.randomBytes(12).toString('hex');
  // var prefix = link.substring(6);
  return {
    link: link,
  }
}
export function issueJWT(userId:String, aud:String) {
  const _id = userId;
  const expiresIn = '1d'

  const payload = {
    sub: _id,
    iat: Date.now(),
    aud: aud,
    exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60),
  };

  const signedToken = jwt.sign(payload, PRIV_KEY, { algorithm: 'RS256' });

  return {
    token: signedToken,
    expires: expiresIn
  }
}

export function verifyToken(token: string, aud: string | string[] | undefined) {
  try {
    const results: any = jwt.verify(token, PUB_KEY, { algorithm: 'RS256' } as VerifyOptions);
    if (results.aud == aud) {
      return { ...results, status: true }
    } else {
      return { status: false }
    }
  } catch (error) {
    console.log(error);
    return { status: false }
  }
}

export function verifyTokenWithoutAud(token: string) {
  try {
    const results:any = jwt.verify(token, PUB_KEY, { algorithm: 'RS256' } as VerifyOptions);
    return { ...results, status: true }
  } catch (error) {
    console.log(error);
    return { status: false }
  }
}

