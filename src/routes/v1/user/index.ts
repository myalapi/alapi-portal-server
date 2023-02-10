import Router from "express";
const router = Router();

router.use("/keys", require("./keys"));
router.use("/userInfo", require("./userInfo"));
router.use("/changePassword", require("./changePassword"));
router.use("/dashboard", require("./getDetails"));

module.exports = router;
