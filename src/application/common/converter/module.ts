import { Module } from '@nestjs/common';
import { ConverterController } from 'app/application/api/converter';
import { ConvertToExcelUseCase } from 'app/application/usecases/converter/convert-to-excel';

@Module({
  providers: [ConvertToExcelUseCase],
  controllers: [ConverterController],
})
export class ConverterModule {}
