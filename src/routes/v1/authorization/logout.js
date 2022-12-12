const userRouter = require('express').Router();
const authMiddle = require('../../../middleware/authMiddle').authMiddle;
const mongoose = require('mongoose');
const User = mongoose.model('User');

userRouter.post('/', authMiddle, async function (req, res) {
    const user = req.authProp.user;
    User.updateOne({ _id: user.id }, { $unset: { token: '', expire: '' } }).then(() => {
        res.clearCookie('jwt').json({ loggedOut: true })
    }).catch(err => {
        console.log(err);
        res.sendStatus(500, err.message)
    })


})
module.exports = userRouter;