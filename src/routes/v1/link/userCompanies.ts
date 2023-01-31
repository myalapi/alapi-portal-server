import Router from "express";
import User from "../../../models/user";

const router = Router();

router.get("/:userId", async (req, res) => {
    const userId: string = req.params.userId;

    try {
        if (userId === null || userId === undefined) {
            throw new Error("UserId not found!");
        }
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found!");
        }

        return res.status(200).json({
            success: true,
            companyName: user.companyName,
        })

    } catch (error: any) {
        console.log(error);
        return res.send({
            success: false,
            message: error.message,
        });
    }
})




module.exports = router;