import { Inject, Injectable } from "@nestjs/common";
import * as fs from "fs/promises";
import * as mime from "mime-types";
import * as xlsx from "xlsx";
import { recognize } from "tesseract.js";
import * as pdf from "pdf-parse";
import * as path from "node:path";
import { InternalFile } from "app/domain";
import { Infrastructure } from "app/common";
import { LanguageModelManager, LanguageModelNames } from "app/infrastructure/language-model";

@Injectable()
export class ConvertToExcelUseCase {
    constructor(
        @Inject(Infrastructure.LanguageModel.Manager)
        private readonly languageModelManager: LanguageModelManager,
    ) {}

    public async execute(input: { file: InternalFile }): Promise<string> {
        const fileName = `${Date.now()}-${input.file.originalName}`;

        const tempPath = path.join("/home/muhammad/me/bankstatementtoexcel", "tmp", fileName);

        await fs.writeFile(tempPath, input.file.buffer);

        const outputPath = await this.processFile(tempPath, fileName);

        await fs.unlink(tempPath);

        return outputPath;
    }

    public async processFile(filePath: string, fileName: string): Promise<string> {
        const mimeType = mime.lookup(filePath);
        let pages;

        if (mimeType === "application/pdf") {
            pages = await this.extractPages(filePath);
        } else if (typeof mimeType === "string" && mimeType.startsWith("image/")) {
            pages = await this.extractTextFromImage(filePath);
        } else {
            throw new Error("Unsupported application/pdfile type");
        }

        const languageModel = this.languageModelManager.setLanguageModel(
            LanguageModelNames.ChatGPT,
        );

        const response = await Promise.all(
            pages.map((chunk) => languageModel.extractTransactionsFromText(chunk)),
        );
        // @ts-ignore
        const result = [];
        for (const res of response) {
            // @ts-ignore
            const arr = JSON.parse(res);
            // @ts-ignore
            result.push(...arr);
        }

        const worksheet = xlsx.utils.json_to_sheet(result);
        const keys = Object.keys(result[0]);
        worksheet["!cols"] = keys.map((key) => {
            const maxLength = Math.max(
                key.length,
                // @ts-ignore
                ...result.map((row) => row[key]?.toString().length || 0),
            );
            return { wch: maxLength + 2 };
        });

        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Transactions");
        xlsx.writeFile(workbook, `/home/muhammad/me/bankstatementtoexcel/tmp/${fileName}.xlsx`);

        return `/home/muhammad/me/bankstatementtoexcel/tmp/${fileName}.xlsx`;
    }

    private async extractPages(pdfPath: string): Promise<any> {
        const dataBuffer = await fs.readFile(pdfPath);
        const options = {
            pagerender: async (pageData: any) => {
                return pageData.getTextContent().then((content: any) => {
                    const pageText = content.items.map((item: any) => item.str).join("");

                    return pageText + "\n[[PAGE_BREAK]]";
                });
            },
        };

        const parsedPDF = await pdf(dataBuffer, options);

        return parsedPDF.text.split("[[PAGE_BREAK]]").filter((page) => page.trim() !== "");
    }

    private async extractTextFromImage(imagePath) {
        const {
            data: { text },
        } = await recognize(imagePath, "eng", {
            logger: (m) => console.log(m.status),
        });

        return text;
    }
}
