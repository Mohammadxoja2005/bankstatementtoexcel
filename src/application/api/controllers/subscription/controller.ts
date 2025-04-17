import { Body, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { SubscriptionCreateCheckoutLinkUseCase } from "app/application/usecases/subcription/create-checkout-link";
import { AuthGuard } from "app/application/api/guard";
import { decode, JwtPayload } from "jsonwebtoken";
import { Request, Response } from "express";
import { UserPlan } from "app/domain";
import { LemonSqueezyProductId } from "app/domain/payment-processor/strategy/lemon-squeezy";

@UseGuards(AuthGuard)
@Controller("subscription")
export class SubscriptionController {
    constructor(
        private readonly subscriptionCreateCheckoutLinkUseCase: SubscriptionCreateCheckoutLinkUseCase,
    ) {}

    @Post("/create-checkout-link/starter")
    async createCheckoutLinkStarter(
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<void> {
        const { userId, email } = decode(request.header("Token") as string) as JwtPayload;

        const checkoutUrl = await this.subscriptionCreateCheckoutLinkUseCase.execute(
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

    @Post("/create-checkout-link/business")
    async createCheckoutLinkBusiness(
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<void> {
        const { userId, email } = decode(request.header("Token") as string) as JwtPayload;

        const checkoutUrl = await this.subscriptionCreateCheckoutLinkUseCase.execute(
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

    @Post("/create-checkout-link/professional")
    async createCheckoutLinkProfessional(
        @Req() request: Request,
        @Res() response: Response,
    ): Promise<void> {
        const { userId, email } = decode(request.header("Token") as string) as JwtPayload;

        const checkoutUrl = await this.subscriptionCreateCheckoutLinkUseCase.execute(
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

    @Get("webhook/callback")
    async webhookCallback(@Body() payload: any, @Headers("X-Signature") signature: string) {
        const paymentStatus = payload.data.status; // Example: 'paid', 'failed', 'pending'

        // Perform your business logic based on payment status
        if (paymentStatus === "paid") {
            // Update the user's subscription to active or grant access
            console.log("Payment successful. Activating user subscription...");
            // You can use the user's email or subscription ID to update the user record in your DB
            // this.userService.activateSubscription(payload.data.email);
        } else if (paymentStatus === "failed") {
            // Handle payment failure, maybe notify the user or retry
            console.log("Payment failed. Notifying the user...");
        }

        return { message: "Webhook processed successfully" };
    }
}
