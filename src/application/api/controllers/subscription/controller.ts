import { Controller, Post, Headers, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { LemonSqueezyTransaction } from "app/domain";

@Controller("subscription")
export class SubscriptionController {
    constructor() {}

    @Post("webhook/payment")
    async handlePaymentStatus(
        @Req() request: Request,
        @Res() response: Response,
        @Headers("X-Signature") signature: string,
    ) {
        const transaction: LemonSqueezyTransaction = request.body;

        console.log("payload webhook", transaction);

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
