import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { userMiddleware } from "../middlewares/user.middleware";
import { UserValidator } from "../validators/user.validator";
import {authMiddleware} from "../middlewares/auth.middleware";
import {ActionTokenTypeEnum} from "../enums/action-token-type.enum";

const router = Router();

router.post(
    "/sign-up",
    userMiddleware.isUserValid(UserValidator.create),
    authController.signUp,
);
router.post(
    "/sign-in",
    userMiddleware.isUserValid(UserValidator.login),
    authController.signIn,
);
router.post(
    "/refresh",
    authMiddleware.checkRefreshToken,
    authController.refresh,
);
router.post(
    "/forgot-password",
    userMiddleware.isUserValid(UserValidator.forgotPassword),
    authController.forgotPassword,
);
let commonMiddleware;
router.put(
    "/forgot-password",
    userMiddleware.isUserValid(UserValidator.setForgotPassword),
    authMiddleware.checkActionToken(ActionTokenTypeEnum.FORGOT),
    authController.setForgotPassword,
);

router.put(
    "/verify",
    authMiddleware.checkActionToken(ActionTokenTypeEnum.VERIFY),
    authController.verify,
);


export const authRouter = router;