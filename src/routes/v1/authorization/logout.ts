import Router from "express";

const userRouter = Router();

userRouter.get("/", async (_req, res) => {

  res.cookie("jwt", "token").status(200).send("cleared");
});

module.exports = userRouter;
