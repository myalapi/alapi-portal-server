const mongoose = require('mongoose');


const Platform = new mongoose.Schema({
    platformKey: String,
    awsSecretName: String,
    isEnabled: Boolean,
    isConfigured: Boolean
});

const UserSchema = new mongoose.Schema({
    email: String,
    name:String,
    companyName: String,
    salt: String,
    hash: String,
    emailConfirmed: Boolean,
    phoneConfirmed: Boolean,
    clientId: String,
    clientSecret: String,
    platforms: [Platform],
    merchants: Array,
    recoverToken: String,
});

mongoose.model('User', UserSchema, 'users');