import base64url from 'base64url';

export function getIdPass(header:any) {
    const authHeader = header["authorization" ];
    const decodedAuth = base64url.decode(authHeader.slice(6));
    const email = decodedAuth.split(':')[0];
    const password = decodedAuth.split(':')[1];
    return { email, password};
}

