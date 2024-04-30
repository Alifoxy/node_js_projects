import { userRepository } from "../repositories/user.repository";
import { IUser } from "../user.interface";
import {ApiError} from "../api-error";

class UserService {
    public async getList(): Promise<IUser[]> {
        return await userRepository.getList();
    }
    public async create(dto: Partial<IUser>): Promise<IUser> {
        return await userRepository.create(dto);
    }
    public async getById(userId:number): Promise<IUser> {
        const user = await userRepository.getById(userId);
        if (!user) {
            throw new ApiError("user not found", 404);
        }
        return user;
    }
    public async updateById(userId:number, dto: Partial<IUser>): Promise<IUser> {
        const user = await userRepository.getById(userId);
        if (!user) {
            throw new ApiError("user not found", 404);
        }
        return await userRepository.updateById(userId, dto);
    }
    public async deleteById(userId:number): Promise<IUser> {
        const user = await userRepository.getById(userId);
        if (!user) {
            throw new ApiError("user not found", 404);
        }
        return await userRepository.deleteById(userId);
    }
}

export const userService = new UserService();