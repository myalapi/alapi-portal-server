import Router from 'express';
const router = Router();



router.use('/authorize', require('./authorization'));
router.use('/recover', require('./authorization/recover'));
router.use('/user', require('./user'));
router.use('/company', require('./company'));
router.use('/platform', require('./platform'));

module.exports = router;