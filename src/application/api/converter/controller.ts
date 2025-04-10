import {
  Controller,
  Post,
  Get,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConvertToExcelUseCase } from '../../usecases/converter/convert-to-excel';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

export type File = {
  originalname: string;
  buffer: Buffer;
};

@Controller('converter')
export class ConverterController {
  constructor(private readonly convertToExcelUseCase: ConvertToExcelUseCase) {}

  @Post('convert_to_excel')
  @UseInterceptors(FileInterceptor('file'))
  async convertToExcel(
    @UploadedFile() file: File,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.convertToExcelUseCase.execute({ file });

    response.download(
      result,
      `${file.originalname.split('.')[0]}.xlsx`,
      (err) => {
        if (err) {
          console.error('Download error:', err);
        }
      },
    );
  }
}
