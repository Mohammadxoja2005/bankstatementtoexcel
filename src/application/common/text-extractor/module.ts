import { Module } from "@nestjs/common";
import { TextExtractorImage, TextExtractorPDF } from "app/infrastructure/text-extractor";
import { TextExtractorManager } from "app/infrastructure/text-extractor/manager/manager";
import { Infrastructure } from "app/common";

@Module({
    imports: [],
    providers: [
        {
            provide: Infrastructure.TextExtractor.PDF,
            useClass: TextExtractorPDF,
        },
        {
            provide: Infrastructure.TextExtractor.Image,
            useClass: TextExtractorImage,
        },
        {
            provide: Infrastructure.TextExtractor.Manager,
            useClass: TextExtractorManager,
        },
    ],
    exports: [Infrastructure.TextExtractor.Manager],
})
export class TextExtractorModule {}
