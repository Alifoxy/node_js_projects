import { NextFunction, Request, Response } from "express";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/api-error";
import {ObjectSchema} from "joi";
import {userRepository} from "../repositories/user.repository";

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
    public isUserValid(validator:ObjectSchema) {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const valid_user  = await validator.validateAsync(req.body);
                if (!valid_user) {
                    throw new ApiError("Invalid user data", 400);
                }
                next();
            } catch (e) {
                next(e);
            }
        }

    }
    public async isEmailExist(email: string): Promise<void> {
        const user = await userRepository.getByParams({ email });
        if (user) {
            throw new ApiError("email already exist", 409);
        }
    }
}

export const userMiddleware = new UserMiddleware();