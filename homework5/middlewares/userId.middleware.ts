import { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";
import {UserValidator} from "../validators/user.validator";

import { ApiError } from "../api-error";
import {ObjectSchema} from "joi";

class UserIdMiddleware {
    public isIdValid(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.params.userId;
            if (!isObjectIdOrHexString(id)) {
                throw new ApiError("Invalid id", 400);
            }
            next();
        } catch (e) {
            next(e);
        }
    }
    public isUserValid() {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const valid_user  = UserValidator.create(req.body);
                if (!valid_user) {
                    throw new ApiError("Invalid data", 400);
                }
                next();
            } catch (e) {
                next(e);
            }
        }

    }
}

export const userIdMiddleware = new UserIdMiddleware();