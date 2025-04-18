import { Body, Controller, Post } from "@nestjs/common";

@Controller("subscription")
export class SubscriptionController {
    constructor() {}

    @Post("webhook/payment")
    async handlePaymentStatus(@Body() payload: any, @Headers("X-Signature") signature: string) {
        const paymentStatus = payload.data.status; // Example: 'paid', 'failed', 'pending'

        // Perform your business logic based on payment status
        if (paymentStatus === "paid") {
            // Update the user's checkout to active or grant access
            console.log("Payment successful. Activating user checkout...");
            // You can use the user's email or checkout ID to update the user record in your DB
            // this.userService.activateSubscription(payload.data.email);
        } else if (paymentStatus === "failed") {
            // Handle payment failure, maybe notify the user or retry
            console.log("Payment failed. Notifying the user...");
        }

        return { message: "Webhook processed successfully" };
    }
}
