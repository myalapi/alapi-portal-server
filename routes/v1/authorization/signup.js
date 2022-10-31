const userRouter = require('express').Router();
const utils = require('../../../utils/userUtils');
const { getIdPass } = require('../../../utils/decodeUtils');
const mongoose = require('mongoose');

const User =  mongoose.model('User');

userRouter.get('/', function (req, res) {
    res.send('No Get Request')
})


userRouter.post('/', async (req, res) =>{
    const { email, password} = getIdPass(req);
    const companyName = req.body.companyName;

    if(!companyName){
        res.json({ success: false, msg: 'Company Name Required' });
    }

    const newUserObj = utils.createNewUser(email, password, companyName);
    const newUser = new User({...newUserObj});

    User.findOne({ email: email }).
        then((user) => {
            if (!user) {
                newUser.save().then(async (user) => {
                    // const emailjwt = utils.issueJWT(user);
                    // const url = `http://localhost:5000/user/verify/confirmation/${emailjwt.token}`
                    // console.log(emailjwt.token)
                    // SendMail({ url: url })
                    res.json({ success: true, msg: 'Account Created successfully' })
                });
            }
            else if (!!user && !user.emaiConfirmed && !user.phoneConfirmed) {
                user.delete();
                newUser.save()
                    .then(async (user) => {
                        // const emailjwt = utils.issueJWT(user, 'email');
                        // const url = `http://localhost:5000/user/verify/confirmation/${emailjwt.token}`
                        // SendMail({ url: url })
                        res.json({ success: true, msg: 'Account Created successfully' })

                    });
            }
            else {
                res.json({ success: false, msg: 'Email already exists' })

            }
        }).catch((err) => {
            console.log(err);
            return res.status(401).json({ success: false, msg: "Could not connect" });
        });
})



module.exports = userRouter;