import { Injectable } from "@nestjs/common";
import { TextExtractorStrategy } from "app/domain";
import { recognize } from "tesseract.js";

@Injectable()
export class TextExtractorImage implements TextExtractorStrategy {
    public async extract(filePath: string): Promise<string[]> {
        const {
            data: { text },
        } = await recognize(filePath, "eng", {
            logger: (m) => console.log(m.status),
        });

        return [text];
    }
}
