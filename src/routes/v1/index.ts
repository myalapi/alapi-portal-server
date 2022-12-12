import Router from 'express';
const router = Router();



router.use('/authorize', require('./authorization'));

module.exports = router;