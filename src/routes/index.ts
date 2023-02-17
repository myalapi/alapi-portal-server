import Router from 'express';
const router = Router();

router.get('/', (_req, res) => {
    res.send("Welcome")
})
router.use('/v1', require('./v1'));

module.exports = router;