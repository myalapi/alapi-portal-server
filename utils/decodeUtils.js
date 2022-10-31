const base64url = require('base64url');

function getIdPass(req) {
    const authHeader = req.headers['authorization'];
    const decodedAuth = base64url.decode(authHeader.slice(6));
    const email = decodedAuth.split(':')[0];
    const password = decodedAuth.split(':')[1];
    return { email, password};
}

module.exports.getIdPass = getIdPass;