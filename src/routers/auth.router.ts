import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { userMiddleware } from "../middlewares/user.middleware";
import { UserValidator } from "../validators/user.validator";
import {authMiddleware} from "../middlewares/auth.middleware";

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


export const authRouter = router;