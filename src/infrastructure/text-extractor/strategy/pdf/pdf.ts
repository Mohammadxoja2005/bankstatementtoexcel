import { TextExtractorStrategy } from "app/domain";
import * as fs from "fs/promises";
import * as pdf from "pdf-parse";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TextExtractorPDF implements TextExtractorStrategy {
    public async extract(filePath: string): Promise<string[]> {
        const dataBuffer = await fs.readFile(filePath);

        const options = {
            pagerender: async (pageData) => {
                return pageData.getTextContent().then((content) => {
                    const pageText = content.items.map((item) => item.str).join("");

                    return pageText + "\n[[PAGE_BREAK]]";
                });
            },
        };

        const parsedPDF = await pdf(dataBuffer, options);

        return parsedPDF.text.split("[[PAGE_BREAK]]").filter((page) => page.trim() !== "");
    }
}
