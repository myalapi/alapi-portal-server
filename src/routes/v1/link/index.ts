import Router from "express";
const router = Router();

router.use("/user", require("./user"));
router.use("/company", require("./company"));
router.use("/platforms", require("./platforms"));

module.exports = router;
