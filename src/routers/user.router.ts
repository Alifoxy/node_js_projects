import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { userMiddleware } from "../middlewares/user.middleware";
import {UserValidator} from "../validators/user.validator";

const router = Router();

router.get("/", userController.getList);
router.post(
    "/",
    userMiddleware.isUserValid(UserValidator.create),
    userController.create);

router.get("/:userId", userMiddleware.isIdValid, userController.getById);
router.put(
    "/:userId",
    userMiddleware.isUserValid(UserValidator.update),
    userMiddleware.isIdValid,
    userController.updateById);
router.delete(
    "/:userId",
    userMiddleware.isIdValid,
    userController.deleteById,
);
export const userRouter = router;