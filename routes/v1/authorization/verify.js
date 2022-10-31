const verifyRouter = require('express').Router();
const { authMiddle } = require('../../../middleware/authMiddle');


verifyRouter.get('/',authMiddle, (req, res)=>{
    res.status(200).json({verified:true});
});

module.exports = verifyRouter;