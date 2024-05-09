import { ApiError } from "../errors/api-error";
import {IToken, ITokenResponse} from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";
import {IJWTPayload} from "../interfaces/jwt-payload.interface";
import {userMiddleware} from "../middlewares/user.middleware";
import {sendGridService} from "./send-grid.service";
import {EmailTypeEnum} from "../enums/email-type.enum";
import {config} from "../configs/config";
import {IForgot, ISetForgot} from "../interfaces/action-token.interface";
import {actionTokenRepository} from "../repositories/action-token.repository";
import {ActionTokenTypeEnum} from "../enums/action-token-type.enum";
import {errorMessages} from "../contants/error-messages.constant";
import {statusCodes} from "../contants/status-codes.constant";

class AuthService {

    public async signUp(
        dto: Partial<IUser>,
    ): Promise<{ user: IUser; tokens: ITokenResponse }> {
        await userMiddleware.isEmailExist(dto.email);
        const hashedPassword = await passwordService.hashPassword(dto.password);
        const user = await userRepository.create({
            ...dto,
            password: hashedPassword,
        });
        const tokens = tokenService.generatePair({
            userId: user._id,
            role: user.role,
        });

        await tokenRepository.create({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            _userId: user._id,
        });

        await sendGridService.sendByType(user.email, EmailTypeEnum.WELCOME, {
            name: dto.name,
            frontUrl: config.FRONT_URL,
            actionToken: "actionToken",
        });

        return { user, tokens };
    }

    public async signIn(dto: {
        email: string;
        password: string;
    }): Promise< {user: IUser; tokens: ITokenResponse} > {
        const user = await userRepository.getByParams({ email: dto.email });
        if (!user) {
            throw new ApiError("Wrong email or password", 401);
        }
        const isCompare = await passwordService.comparePassword(
            dto.password,
            user.password,
        );
        if (!isCompare) {
            throw new ApiError("Wrong email or password", 401);
        }
        const tokens = tokenService.generatePair({
            userId: user._id,
            role: user.role,
        });

        await tokenRepository.create({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            _userId: user._id,
        });
        return {user, tokens};
    }

    public async refresh(
        jwtPayload: IJWTPayload,
        oldPair: IToken,
    ): Promise<ITokenResponse> {
        const newPair = tokenService.generatePair({
            userId: jwtPayload.userId,
            role: jwtPayload.role,
        });

        await tokenRepository.deleteById(oldPair._id);
        await tokenRepository.create({
            ...newPair,
            _userId: jwtPayload.userId,
        });
        return newPair;
    }

    public async forgotPassword(dto: IForgot): Promise<void> {
        const user = await userRepository.getByParams({ email: dto.email });
        if (!user) return;

        const actionToken = tokenService.generateActionToken(
            { userId: user._id, role: user.role },
            ActionTokenTypeEnum.FORGOT,
        );
        await actionTokenRepository.create({
            tokenType: ActionTokenTypeEnum.FORGOT,
            actionToken,
            _userId: user._id,
        });
        await sendGridService.sendByType(user.email, EmailTypeEnum.RESET_PASSWORD, {
            frontUrl: config.FRONT_URL,
            actionToken,
        });
    }

    public async setForgotPassword(
        dto: ISetForgot,
        jwtPayload: IJWTPayload,
    ): Promise<void> {
        const user = await userRepository.getById(jwtPayload.userId);
        const hashedPassword = await passwordService.hashPassword(dto.password);

        await userRepository.updateById(user._id, { password: hashedPassword });
        await actionTokenRepository.deleteByParams({
            tokenType: ActionTokenTypeEnum.FORGOT,
        });
        await tokenRepository.deleteByParams({ _userId: user._id });
    }

    public async verify(jwtPayload: IJWTPayload): Promise<IUser> {
        const [user] = await this.Promise.all([
            userRepository.updateById(jwtPayload.userId, {
                isVerified: true,
            }),
            actionTokenRepository.deleteByParams({
                tokenType: ActionTokenTypeEnum.VERIFY,
            }),
        ]);
        return user;
    }

    private async isEmailExist(email: string): Promise<void> {
        const user = await userRepository.getByParams({ email, isDeleted: true });
        if (user) {
            throw new ApiError(
                errorMessages.EMAIL_ALREADY_EXIST,
                statusCodes.CONFLICT,
            );
        }
    }
}

export const authService = new AuthService();