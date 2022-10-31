const userRouter = require('express').Router();
const mongoose = require('mongoose');
const utils = require('../../../utils/userUtils');
const {aud} = require('../../../config/aud');
const User = mongoose.model('User');
const {getIdPass} = require('../../../utils/decodeUtils');

userRouter.get('/', function (req, res) {
    res.send('No GET Login Request');
})

userRouter.post('/', function (req, res) {
    const {email, password} = getIdPass(req)
    User.findOne({email:email})
        .then(async (user) => {
            if (!user) {
                return res.json({ success: false, msg: 'e2' });
                // e2=InvalidEmail
            }
            if(!!user && !user.emailConfirmed) {
                return res.json({ success: false, msg: 'e3' });
                // e3=UnconfirmedEmail
            }
            // Function defined at bottom of app.js
            const isValid = utils.validPassword(password, user.hash, user.salt);

            if (isValid) {
                const tokenObject = utils.issueJWT(user, aud.session);
                let options = {
                    sameSite: 'None',
                    secure: true,
                    maxAge: 1000000 * 60 * 15, // would expire after 15 minutes
                    httpOnly: true, // The cookie only accessible by the web server
                     // Indicates if the cookie should be signed
                }
                await User.updateOne({_id: user._id},{$set :{ token: tokenObject.token, expire:tokenObject.expires}}).then(()=>{
                    res.cookie('jwt', tokenObject.token, options).status(200)
                    .json({ success: true, user:{name: user.name,email:user.email}})
                }).catch((err)=>{
                    res.sendStatus(500, err);
                });
               
                    

            } else {
                res.json({ success: false, msg: "e1" });
                // e1=invalidpassword;
            }
        })
        .catch((err) => {
            console.log(err);
            return res.json({ success: false, msg: "e2" });
        });

})

module.exports = userRouter;