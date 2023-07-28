import Router from "express";
const router = Router();

router.use("/user", require("./user"));
router.use("/merchant", require("./merchant"));
router.use("/platforms", require("./platforms"));

module.exports = router;
