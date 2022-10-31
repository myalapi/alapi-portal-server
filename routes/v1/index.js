const router = require('express').Router();

router.use('/authorize', require('./authorization'));

module.exports = router;