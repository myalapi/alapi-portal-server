const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToPrivateKey = path.join(__dirname, '..', 'keys', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToPrivateKey, 'utf8');

const pathToPublicKey = path.join(__dirname, '..', 'keys', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToPublicKey, 'utf8');


function validPassword(password, hash, salt) {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

function createNewUser(email, password, companyName) {
  const saltHash = genPassword(password);
  const apiHash = genAPIKey();

  const userObj = {
    email: email,
    companyName: companyName,
    salt: saltHash.salt,
    hash: saltHash.hash,
    emailConfirmed: false,
    phoneConfirmed: false,
    apiKey: apiHash.apiKey
  }
  return userObj;
}

function genPassword(password) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  return {
    salt: salt,
    hash: genHash
  };
}

function genAPIKey(){
  
  var apiKey = crypto.randomBytes(12).toString('hex');
  var prefix = apiKey.substring(6);
  // var apiSalt =crypto.randomBytes(32).toString('hex');
  // var genApiHash = crypto.pbkdf2Sync(apiKey, salt, 10000, 32, 'sha512').toString('hex');
  return {
    // apiSalt: apiSalt,
    // genApiHash: genApiHash,
    // prefix: prefix,
    apiKey: apiKey,
  }

}
function issueJWT(userId, aud) {
  const _id = userId;
  expiresIn = '1d'

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

function verifyToken(token, aud) {
  try {
    const results = jwt.verify(token, PUB_KEY, { algorithm: 'RS256' });
    if (results.aud == aud) {
      return { ...results, status: true }
    } else {
      return { status: false }
    }
  } catch (error) {
    console.log(error.message);
    return { status: false }
  }
}

function verifyTokenWithoutAud(token) {
  try {
    const results = jwt.verify(token, PUB_KEY, { algorithm: 'RS256' });
    return { ...results, status: true }
  } catch (error) {
    console.log(error.message);
    return { status: false }
  }
}

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
module.exports.verifyToken = verifyToken;
module.exports.verifyTokenWithoutAud = verifyTokenWithoutAud;
module.exports.createNewUser = createNewUser;