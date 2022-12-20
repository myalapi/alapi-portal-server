import Router from "express";
const router = Router();

router.use("/getKeys", require("./getKeys"));

module.exports = router;
