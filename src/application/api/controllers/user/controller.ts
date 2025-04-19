import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { UserAuthenticateUseCase } from "app/application/usecases/user/authenticate";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";

type AuthenticatedRequest = Request & {
    user: {
        id: string;
        _json: { name?: string; email?: string; email_verified?: boolean };
    };
};

@Controller("user")
export class UserController {
    constructor(private readonly userAuthenticateUseCase: UserAuthenticateUseCase) {}

    @Get("google")
    @UseGuards(AuthGuard("google"))
    async googleAuth() {}

    @Get("google/callback")
    @UseGuards(AuthGuard("google"))
    async googleAuthCallback(
        @Req() request: AuthenticatedRequest,
        @Res() response: Response,
    ): Promise<void> {
        const user = await this.userAuthenticateUseCase.execute({
            name: request.user._json.name ?? null,
            email: request.user._json.email ?? null,
            googleId: request.user.id,
        });

        response.json(user);
    }
}
