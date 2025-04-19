import { Controller, Headers, Inject, Post, RawBodyRequest, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { LemonSqueezyEvent, LemonSqueezyTransaction, UserPlan } from "app/domain";
import * as crypto from "node:crypto";
import * as process from "node:process";
import { Application } from "app/common";
import {
    SubscriptionActivateUseCase,
    SubscriptionDeactivateUseCase,
} from "app/application/usecases/subscription";

@Controller("subscription")
export class SubscriptionController {
    constructor(
        @Inject(Application.UseCase.Subscription.Activate)
        private readonly subscriptionActivateUseCase: SubscriptionActivateUseCase,
        @Inject(Application.UseCase.Subscription.Deactivate)
        private readonly subscriptionDeactivateUseCase: SubscriptionDeactivateUseCase,
    ) {}

    @Post("webhook/payment")
    async handlePaymentStatus(
        @Req() request: RawBodyRequest<Request>,
        @Res() response: Response,
        @Headers("X-Signature") signature: string,
    ) {
        const transaction: LemonSqueezyTransaction = request.body;

        const hmac = crypto.createHmac("sha256", process.env.LEMON_SQUEEZY_WEBHOOK_SIGNATURE || "");

        const digest = Buffer.from(hmac.update(request.rawBody || "").digest("hex"), "utf8");
        const expectedSignature = Buffer.from(signature, "utf8");

        if (!crypto.timingSafeEqual(digest, expectedSignature)) {
            throw new Error("Invalid signature.");
        }

        if (
            [
                LemonSqueezyEvent.SUBSCRIPTION_PAYMENT_SUCCESS,
                LemonSqueezyEvent.SUBSCRIPTION_UPDATED,
                LemonSqueezyEvent.SUBSCRIPTION_PLAN_CHANGED,
            ].includes(transaction.meta.event_name)
        ) {
            const userId = transaction.meta.custom_data.userId;
            const plan = transaction.meta.custom_data.plan;

            await this.subscriptionActivateUseCase.execute({
                id: userId,
                plan: plan,
            });
        }

        if (
            [
                LemonSqueezyEvent.SUBSCRIPTION_CANCELLED,
                LemonSqueezyEvent.SUBSCRIPTION_PAYMENT_FAILED,
            ].includes(transaction.meta.event_name)
        ) {
            const userId = transaction.meta.custom_data.userId;

            await this.subscriptionDeactivateUseCase.execute({ id: userId, plan: UserPlan.TRIAL });
        }
    }
}
