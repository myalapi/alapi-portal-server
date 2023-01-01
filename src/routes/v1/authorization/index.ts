import Router from 'express';
const router = Router();


router.use('/login', require('./login'));
router.use('/signup', require('./signup'));
router.use('/verify', require('./verify'));
router.use('/recover', require('./recover'));

module.exports = router;