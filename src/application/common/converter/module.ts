import { Module } from "@nestjs/common";
import { LanguageModelModule } from "app/infrastructure/language-model";
import { ConvertToExcelUseCase } from "app/application/usecases/converter/convert-to-excel";
import { ConverterController } from "app/application/api/converter";

@Module({
    imports: [LanguageModelModule],
    providers: [ConvertToExcelUseCase],
    controllers: [ConverterController],
})
export class ConverterModule {}
