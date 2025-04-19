import { Controller, Post, Headers, Req, Res, RawBodyRequest } from "@nestjs/common";
import { Request, Response } from "express";
import { LemonSqueezyTransaction } from "app/domain";
import * as crypto from "node:crypto";
import * as process from "node:process";

@Controller("subscription")
export class SubscriptionController {
    constructor() {}

    @Post("webhook/payment")
    async handlePaymentStatus(
        @Req() request: RawBodyRequest<Request>,
        @Res() response: Response,
        @Headers("X-Signature") signature: string,
    ) {
        const transaction: LemonSqueezyTransaction = request.body;

        // console.log("payload webhook", transaction, signature);

        const hmac = crypto.createHmac("sha256", process.env.LEMON_SQUEEZY_WEBHOOK_SIGNATURE || "");

        const digest = Buffer.from(hmac.update(request.rawBody || "").digest("hex"), "utf8");
        const expectedSignature = Buffer.from(signature, "utf8");

        // const expectedSignature = crypto
        //     .createHmac("sha256", "642a7fff-b8ba-4335-a886-0588f60043d9")
        //     .update(JSON.stringify(request.body))
        //     .digest("hex");

        if (!crypto.timingSafeEqual(digest, expectedSignature)) {
            throw new Error("Invalid signature.");
        } else {
            console.log("success");
            console.log(request.rawBody);
            console.log(request.body);
        }
        // Perform your business logic based on payment status
        // if (paymentStatus === "paid") {
        //     // Update the user's checkout to active or grant access
        //     console.log("Payment successful. Activating user checkout...");
        //     // You can use the user's email or checkout ID to update the user record in your DB
        //     // this.userService.activateSubscription(payload.data.email);
        // } else if (paymentStatus === "failed") {
        //     // Handle payment failure, maybe notify the user or retry
        //     console.log("Payment failed. Notifying the user...");
        // }

        response.json({});
    }
}
