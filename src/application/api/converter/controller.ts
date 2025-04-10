import {
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConvertToExcelUseCase } from '../../usecases/converter/convert-to-excel';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from 'app/domain';

@Controller('converter')
export class ConverterController {
  constructor(private readonly convertToExcelUseCase: ConvertToExcelUseCase) {}

  @Post('convert_to_excel')
  @UseInterceptors(FileInterceptor('file'))
  async convertToExcel(
    @UploadedFile() file: MulterFile,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.convertToExcelUseCase.execute({
      file: {
        originalName: file.originalname,
        buffer: file.buffer,
        mimeType: file.mimetype,
        size: file.size,
      },
    });

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
