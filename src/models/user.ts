const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    name: String,
    companyName: String,
    clientId: String,
    clientSecret: String,
    salt: String,
    hash: String,
    emailConfirmed: Boolean,
    phoneConfirmed: Boolean,
    recoverToken: String,
});

mongoose.model('User', UserSchema, 'users');