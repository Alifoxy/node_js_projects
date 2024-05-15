import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { userMiddleware } from "../middlewares/user.middleware";
import {authMiddleware} from "../middlewares/auth.middleware";
import {UserValidator} from "../validators/user.validator";
import {fileMiddleware} from "../middlewares/file.middleware";

const router = Router();

router.get("/", userController.getList);
router.post(
    "/",
    userMiddleware.isUserValid(UserValidator.create),
    userController.create,
);
router.get("/:userId", userMiddleware.isIdValid, userController.getById);
router.put(
    "/:userId",
    userMiddleware.isUserValid(UserValidator.update),
    userMiddleware.isIdValid,
    userController.updateById);


router.get("/me", authMiddleware.checkAccessToken, userController.getMe);
router.put(
    "/me",
    authMiddleware.checkAccessToken,
    userMiddleware.isUserValid(UserValidator.update),
    userController.updateMe,
);

router.post(
    "/me/avatar",
    authMiddleware.checkAccessToken,
    fileMiddleware.isAvatarValid,
    userController.uploadAvatar,
);

router.delete(
    "/me/avatar",
    authMiddleware.checkAccessToken,
    userController.deleteAvatar,
);

router.delete("/me", authMiddleware.checkAccessToken, userController.deleteMe);
router.delete(
    "/:userId",
    userMiddleware.isIdValid,
    userController.deleteById,
);
export const userRouter = router;