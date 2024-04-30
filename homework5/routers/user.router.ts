import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { userIdMiddleware } from "../middlewares/userId.middleware";

const router = Router();

router.get("/", userController.getList);
router.post("/", userController.create);

router.get("/:userId", userIdMiddleware.isIdValid, userController.getById);
router.put("/:userId", userIdMiddleware.isIdValid, userController.updateById);
router.delete(
    "/:userId",
    userIdMiddleware.isIdValid,
    userController.deleteById,
);
export const userRouter = router;