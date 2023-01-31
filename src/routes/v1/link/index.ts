import Router from 'express';
const router = Router();


router.use('/user', require('./userCompanies'));
router.use('/company', require('./createMerchant'));
router.use('/platforms', require('./getAllplatforms'));

module.exports = router;