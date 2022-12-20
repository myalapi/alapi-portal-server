import Router from 'express';
import {createNewUser} from '../../../utils/userUtils';
import { getIdPass } from '../../../utils/decodeUtils';

const userRouter = Router();
import mongoose from 'mongoose';
const User =  mongoose.model('User');

userRouter.get('/', function (_req, res) {
    res.send('No Get Request')
})


userRouter.post('/', async (req, res) =>{
    const { email, password} = getIdPass(req.headers);
    const {companyName, name} = req.body;

    if(!companyName || !name){
        res.json({ success: false, msg: 'Company Name or Name Required' });
    }

    const newUserObj = createNewUser(email, password, companyName, name);
    const newUser = new User({...newUserObj});

    User.findOne({ email: email }).
        then((user:any) => {
            if (!user) {
                newUser.save().then(async (_user) => {
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
                    .then(async (_user) => {
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