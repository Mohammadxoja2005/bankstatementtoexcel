import { Inject, Injectable } from "@nestjs/common";
import * as fs from "fs/promises";
import * as mime from "mime-types";
import * as path from "node:path";
import { InternalFile, LanguageModelNames, Transaction } from "app/domain";
import { Infrastructure } from "app/common";
import { LanguageModelManager } from "app/infrastructure/language-model";
import { FileBuilderExcel } from "app/infrastructure/file-builder";
import { TextExtractorManager } from "app/infrastructure/text-extractor";
import { MimeType } from "app/domain/text-extractor/types";

@Injectable()
export class ConvertToExcelUseCase {
    constructor(
        @Inject(Infrastructure.LanguageModel.Manager)
        private readonly languageModelManager: LanguageModelManager,
        @Inject(Infrastructure.FileBuilder.Excel)
        private readonly fileBuilderExcel: FileBuilderExcel,
        @Inject(Infrastructure.TextExtractor.Manager)
        private readonly textExtractorManager: TextExtractorManager,
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

        const textExtractor = this.textExtractorManager.setExtractor(mimeType as MimeType);
        const pages = await textExtractor.extract(filePath);

        const languageModel = this.languageModelManager.setLanguageModel(
            LanguageModelNames.ChatGPT,
        );

        const response = await Promise.all(
            pages.map((chunk) => languageModel.extractTransactionsFromText(chunk)),
        );

        const result: Transaction[] = [];

        for (const res of response) {
            const arr = JSON.parse(res);
            result.push(...arr);
        }

        return this.fileBuilderExcel.build({
            file: {
                name: fileName,
            },
            transactions: result,
        });
    }
}
