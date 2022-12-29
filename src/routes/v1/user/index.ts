import Router from "express";
const router = Router();

router.use("/keys", require("./keys"));
router.use("/userInfo", require("./userInfo"));
router.use("/changePassword", require("./changePassword"));

module.exports = router;
