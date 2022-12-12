const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: String,
    companyName: String,
    apiKey: String,
    link: String,
    salt: String,
    hash: String,
    emailConfirmed: Boolean,
    phoneConfirmed: Boolean
});

mongoose.model('User', UserSchema, 'users');