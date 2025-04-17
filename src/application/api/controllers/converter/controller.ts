import { Controller, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ConvertToExcelUseCase } from "../../../usecases/converter/convert-to-excel";
import { Response } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterFile } from "app/domain";
import * as fs from "fs/promises";

@Controller("converter")
export class ConverterController {
    constructor(private readonly convertToExcelUseCase: ConvertToExcelUseCase) {}

    @Post("convert_to_excel")
    @UseInterceptors(FileInterceptor("file"))
    async convertToExcel(
        @UploadedFile() file: MulterFile,
        @Res() response: Response,
    ): Promise<void> {
        let fileNameToReturn = "";
        const result = await this.convertToExcelUseCase.execute({
            file: {
                originalName: file.originalname,
                buffer: file.buffer,
                mimeType: file.mimetype,
                size: file.size,
            },
        });

        const lastDotIndex = file.originalname.lastIndexOf(".");
        if (lastDotIndex === -1) {
            fileNameToReturn = file.originalname;
        } else {
            fileNameToReturn = file.originalname.slice(0, lastDotIndex);
        }

        response.download(result, `${fileNameToReturn}.xlsx`, async (err) => {
            if (err) {
                console.error("Download error:", err);
            }

            await fs.unlink(result);
        });
    }
}
