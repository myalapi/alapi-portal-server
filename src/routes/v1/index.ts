import Router from 'express';
const router = Router();



router.use('/authorize', require('./authorization'));
router.use('/user', require('./user'));

module.exports = router;