import Router from 'express';
const router = Router();



router.use('/authorize', require('./authorization'));
router.use('/user', require('./user'));
router.use('/companies', require('./company/companies'));
router.use('/platform', require('./platform'));

module.exports = router;