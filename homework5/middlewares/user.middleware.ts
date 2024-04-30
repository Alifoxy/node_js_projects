import { NextFunction, Request, Response } from "express";
import {userSchema} from "../validators/user.schema";

import { ApiError } from "../api-error";

class UserMiddleware {
    public isUserValid(req: Request, res: Response, next: NextFunction) {
        try {
            const valid_user  = userSchema.validate(req.body);
            if (!valid_user) {
                throw new ApiError("Invalid data", 400);
            }
            next();
        } catch (e) {
            next(e);
        }
    }
}

export const userMiddleware = new UserMiddleware();