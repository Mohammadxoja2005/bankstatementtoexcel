import { Module } from "@nestjs/common";
import { LanguageModelModule } from "app/infrastructure/language-model";
import { ConvertToExcelUseCase } from "app/application/usecases/converter/convert-to-excel";
import { ConverterController } from "app/application/api/converter";
import { FileBuilderModule } from "app/infrastructure/file-builder/module";
import { TextExtractorModule } from "app/infrastructure/text-extractor/module";

@Module({
    imports: [LanguageModelModule, FileBuilderModule, TextExtractorModule],
    providers: [ConvertToExcelUseCase],
    controllers: [ConverterController],
})
export class ConverterModule {}
