import Router from 'express';
const router = Router();


router.use('/login', require('./login'));
// router.use('/login/recover', require('./recover'));
router.use('/signup', require('./signup'));
// router.use('/verify', require('./verify'));
// router.use('/verification', require('./verification'));
// // router.use('/recover', require('./recover'));
// router.use('/logout', require('./logout'));
// router.use('/isAuth', require('./isAuth'));

module.exports = router;