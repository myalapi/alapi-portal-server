import Router from "express";
import { verifyJWT } from "../../../utils/jwtUtils";
import { updateUserConfirm } from "../../../dal/user";

const router = Router();

router.get("/:token", async (req, res) => {
  const token = req.params.token;

  try {
    const verify: any = verifyJWT(token);

    await updateUserConfirm(verify.sub);

    return res.redirect(`${process.env.WEB_URL}`);
  } catch (error) {
    console.log(error);
    return res.send("Url is invalid, PLease Try Again");
  }
});

module.exports = router;
