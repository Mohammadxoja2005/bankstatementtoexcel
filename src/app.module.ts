import { Module } from "@nestjs/common";
import {
    TextExtractorModule,
    FileBuilderModule,
    LanguageModelModule,
    ConverterModule,
} from "app/application/common";
import { CheckoutModule } from "app/application/common/checkout";
import { PaymentProcessorModule } from "app/application/common/payment-processor";
import { AuthModule } from "app/application/common/auth";
import { MongooseModule } from "app/application/common/mongoose";
import { UserModule } from "app/application/common/user";
import { SubscriptionModule } from "app/application/common/subscription";

@Module({
    imports: [
        ConverterModule,
        TextExtractorModule,
        FileBuilderModule,
        LanguageModelModule,
        CheckoutModule,
        PaymentProcessorModule,
        AuthModule,
        MongooseModule,
        UserModule,
        SubscriptionModule,
    ],
})
export class AppModule {}
