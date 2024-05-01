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
    public async getById(userId:string): Promise<IUser> {
        const user = await userRepository.getById(userId);
        if (!user) {
            throw new ApiError("user not found", 404);
        }
        return user;
    }
    public async updateById(userId:string, dto: Partial<IUser>): Promise<IUser> {
        const user = await userRepository.getById(userId);
        if (!user) {
            throw new ApiError("user not found", 404);
        }
        return await userRepository.updateById(userId, dto);
    }
    public async deleteById(userId:string): Promise<void> {
        const user = await userRepository.getById(userId);
        if (!user) {
            throw new ApiError("user not found", 404);
        }
        return await userRepository.deleteById(userId);
    }

    private async isEmailExist(email: string): Promise<void> {
        const user = await userRepository.getByParams({ email });
        if (user) {
            throw new ApiError("email already exist", 409);
        }
    }

    private async findUserOrThrow(userId: string): Promise<IUser> {
        const user = await userRepository.getById(userId);
        if (!user) {
            throw new ApiError("user not found", 404);
        }
        return user;
    }
}

export const userService = new UserService();