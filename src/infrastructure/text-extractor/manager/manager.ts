import { Inject, Injectable } from "@nestjs/common";
import { TextExtractorStrategy } from "app/domain";
import { MimeType } from "app/domain/text-extractor/types";
import { Infrastructure } from "app/common";

@Injectable()
export class TextExtractorManager {
    constructor(
        @Inject(Infrastructure.TextExtractor.PDF)
        private readonly textPdfExtractor: TextExtractorStrategy,
        @Inject(Infrastructure.TextExtractor.Image)
        private readonly textImageExtractor: TextExtractorStrategy,
    ) {}

    public setExtractor(mimeType: MimeType): TextExtractorStrategy {
        if (mimeType === MimeType.PDF) {
            return this.textPdfExtractor;
        }

        if (mimeType === MimeType.JPEG || mimeType === MimeType.PNG || mimeType === MimeType.JPG)
            return this.textImageExtractor;

        throw `Unsupported mime type: ${mimeType}`;
    }
}
