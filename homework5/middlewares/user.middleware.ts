import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";

import { ApiError } from "../api-error";
import {isObjectIdOrHexString} from "mongoose";

class UserMiddleware {
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
    public isUserValid(validator: ObjectSchema) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const valid_user = validator.validateAsync(req.body);
                if (!valid_user) {
                    throw new ApiError("Invalid user data", 400);
                }
                next();
            } catch (e) {
                next(e);
            }
        }
    }
}

export const userMiddleware = new UserMiddleware();