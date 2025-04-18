import { Body, Controller, Post, Headers, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";

@Controller("subscription")
export class SubscriptionController {
    constructor() {}

    @Post("webhook/payment")
    async handlePaymentStatus(
        @Req() request: Request,
        @Res() response: Response,
        @Headers("X-Signature") signature: string,
    ) {
        // const paymentStatus = payload.data.status; // Example: 'paid', 'failed', 'pending'
        console.log("payload webhook", request.body);
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
