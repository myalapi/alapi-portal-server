const confirmRouter = require('express').Router();
const utils = require('../../../utils/userUtils');
const recoverVerify = require('../../../middleware/recoverVerifyMiddle').recoverVerify;
const {aud} = require('../../../config/aud')
const mongoose = require('mongoose');
const User = mongoose.model('User');


confirmRouter.get('/verification/:token', async (req, res) => {
    const token = req.params.token;
    console.log(token);
    const verify = utils.verifyToken(token, aud.email);
    if (verify.status == true) {
        await User.updateOne({ _id: verify.id }, { $set: { emailConfirmed: true } }).then(() => { 
                res.redirect('http://localhost:3000/login')
             }).
            catch(err => console.log(err))
    } else {
        console.log('err');
    }
})

confirmRouter.get('/recover/:token',recoverVerify, async (req, res) => {
   res.json(req.json);
})


module.exports = confirmRouter;