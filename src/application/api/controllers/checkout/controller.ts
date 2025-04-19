import { Controller, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { CheckoutCreateLinkUseCase } from "src/application/usecases/checkout/create-link";
import { AuthGuard } from "app/application/api/guard";
import { decode, JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import { UserSubscriptionPlan, LemonSqueezySubscription } from "app/domain";

@UseGuards(AuthGuard)
@Controller("checkout")
export class CheckoutController {
    constructor(private readonly checkoutCreateLinkUseCase: CheckoutCreateLinkUseCase) {}

    @Post("/create-link/starter")
    async createCheckoutLinkStarter(
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<void> {
        const { userId, email, name } = decode(request.header("Token") as string) as JwtPayload;

        const checkoutUrl = await this.checkoutCreateLinkUseCase.execute(
            {
                store: {
                    id: LemonSqueezySubscription.Store.Id,
                },
                product: {
                    id: LemonSqueezySubscription.Product.Id.Starter,
                },
                customer: {
                    email: email,
                    name: name,
                },
            },
            {
                userId: userId,
                plan: UserSubscriptionPlan.STARTER,
            },
        );

        response.status(HttpStatus.OK).json({ checkout_url: checkoutUrl });
    }

    @Post("/create-link/business")
    async createCheckoutLinkBusiness(
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<void> {
        const { userId, email, name } = decode(request.header("Token") as string) as JwtPayload;

        const checkoutUrl = await this.checkoutCreateLinkUseCase.execute(
            {
                store: {
                    id: LemonSqueezySubscription.Store.Id,
                },
                product: {
                    id: LemonSqueezySubscription.Product.Id.Business,
                },
                customer: {
                    email: email,
                    name: name,
                },
            },
            {
                userId: userId,
                plan: UserSubscriptionPlan.BUSINESS,
            },
        );

        response.status(HttpStatus.OK).json({ checkout_url: checkoutUrl });
    }

    @Post("/create-link/professional")
    async createCheckoutLinkProfessional(
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<void> {
        const { userId, email, name } = decode(request.header("Token") as string) as JwtPayload;

        const checkoutUrl = await this.checkoutCreateLinkUseCase.execute(
            {
                store: {
                    id: LemonSqueezySubscription.Store.Id,
                },
                product: {
                    id: LemonSqueezySubscription.Product.Id.Professional,
                },
                customer: {
                    email: email,
                    name: name,
                },
            },
            {
                userId: userId,
                plan: UserSubscriptionPlan.PROFESSIONAL,
            },
        );

        response.status(HttpStatus.OK).json({ checkout_url: checkoutUrl });
    }
}
