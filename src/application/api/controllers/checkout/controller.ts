import { Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { CheckoutCreateLinkUseCase } from "src/application/usecases/checkout/create-link";
import { AuthGuard } from "app/application/api/guard";
import { decode, JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import { UserPlan } from "app/domain";
import { LemonSqueezyProductId } from "app/domain/payment-processor/strategy/lemon-squeezy";

@UseGuards(AuthGuard)
@Controller("checkout")
export class CheckoutController {
    constructor(private readonly checkoutCreateLinkUseCase: CheckoutCreateLinkUseCase) {}

    @Post("/create-link/starter")
    async createCheckoutLinkStarter(
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<void> {
        const { userId, email } = decode(request.header("Token") as string) as JwtPayload;

        const checkoutUrl = await this.checkoutCreateLinkUseCase.execute(
            {
                product: {
                    id: LemonSqueezyProductId.STARTER,
                },
                customer: {
                    email: email,
                },
            },
            {
                userId: userId,
                plan: UserPlan.STARTER,
            },
        );

        response.redirect(checkoutUrl);
    }

    @Post("/create-link/business")
    async createCheckoutLinkBusiness(
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<void> {
        const { userId, email } = decode(request.header("Token") as string) as JwtPayload;

        const checkoutUrl = await this.checkoutCreateLinkUseCase.execute(
            {
                product: {
                    id: LemonSqueezyProductId.BUSINESS,
                },
                customer: {
                    email: email,
                },
            },
            {
                userId: userId,
                plan: UserPlan.BUSINESS,
            },
        );

        response.redirect(checkoutUrl);
    }

    @Post("/create-link/professional")
    async createCheckoutLinkProfessional(
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<void> {
        const { userId, email } = decode(request.header("Token") as string) as JwtPayload;

        const checkoutUrl = await this.checkoutCreateLinkUseCase.execute(
            {
                product: {
                    id: LemonSqueezyProductId.PROFESSIONAL,
                },
                customer: {
                    email: email,
                },
            },
            {
                userId: userId,
                plan: UserPlan.PROFESSIONAL,
            },
        );

        response.redirect(checkoutUrl);
    }
}
