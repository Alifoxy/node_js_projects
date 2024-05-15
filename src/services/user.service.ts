import { userRepository } from "../repositories/user.repository";
import { IUser } from "../interfaces/user.interface";
import {ApiError} from "../errors/api-error";
import {UploadedFile} from "express-fileupload";
import {FileItemTypeEnum} from "../enums/file-item-type.enum";
import {s3Service} from "./s3.service";

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

    public async getMe(userId: string): Promise<IUser> {
        return await this.findUserOrThrow(userId);
    }

    public async updateMe(userId: string, dto: Partial<IUser>): Promise<IUser> {
        await this.findUserOrThrow(userId);
        return await userRepository.updateById(userId, dto);
    }

    public async deleteMe(userId: string): Promise<void> {
        await this.findUserOrThrow(userId);
        await userRepository.updateById(userId, { isDeleted: true });
    }

    private async findUserOrThrow(userId: string): Promise<IUser> {
        const user = await userRepository.getById(userId);
        if (!user) {
            throw new ApiError("user not found", 404);
        }
        return user;
    }

    public async uploadAvatar(
        userId: string,
        avatar: UploadedFile,
    ): Promise<IUser> {
        const user = await this.findUserOrThrow(userId);
        const filePath = await s3Service.uploadFile(
            avatar,
            FileItemTypeEnum.USER,
            user._id,
        );
        if (user.avatar) {
            // TODO: delete old avatar
        }
        return await userRepository.updateById(userId, { avatar: filePath });
    }

    public async deleteAvatar(userId: string): Promise<IUser> {
        const user = await this.findUserOrThrow(userId);
        if (user.avatar) {
            await s3Service.deleteFile(user.avatar);
        }
        return await userRepository.updateById(userId, { avatar: null });
    }
}

export const userService = new UserService();