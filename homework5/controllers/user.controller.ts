import { NextFunction, Request, Response } from "express";

import { userService } from "../services/user.service";
import { IUser } from "../interfaces/user.interface";
import {IJWTPayload} from "../interfaces/jwt-payload.interface";

class UserController {
    public async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.getList();
            res.json(users);
        } catch (e) {
            next(e);
        }
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId;
            const user = await userService.getById(userId);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }

    public async updateById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId;
            const dto = req.body as Partial<IUser>;

            const user = await userService.updateById(userId, dto);
            res.status(201).json(user);
        } catch (e) {
            next(e);
        }
    }

    public async deleteById(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.userId;
            await userService.deleteById(userId);
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    }
    public async getMe(req: Request, res: Response, next: NextFunction) {
        try {
            const jwtPayload = req.res.locals.jwtPayload as IJWTPayload;
            const user = await userService.getMe(jwtPayload.userId);
            res.json(user);
        } catch (e) {
            next(e);
        }
    }

    public async updateMe(req: Request, res: Response, next: NextFunction) {
        try {
            const jwtPayload = req.res.locals.jwtPayload as IJWTPayload;
            const dto = req.body as Partial<IUser>;

            const user = await userService.updateMe(jwtPayload.userId, dto);
            res.status(201).json(user);
        } catch (e) {
            next(e);
        }
    }

    public async deleteMe(req: Request, res: Response, next: NextFunction) {
        try {
            const jwtPayload = req.res.locals.jwtPayload as IJWTPayload;
            await userService.deleteMe(jwtPayload.userId);
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    }

}


export const userController = new UserController();