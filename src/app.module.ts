import { Module } from "@nestjs/common";
import {
    TextExtractorModule,
    FileBuilderModule,
    LanguageModelModule,
    ConverterModule,
} from "app/application/common";
import { CheckoutModule } from "app/application/common/checkout";
import { PaymentProcessorModule } from "app/application/common/payment-processor";

@Module({
    imports: [
        ConverterModule,
        TextExtractorModule,
        FileBuilderModule,
        LanguageModelModule,
        CheckoutModule,
        PaymentProcessorModule,
    ],
})
export class AppModule {}
