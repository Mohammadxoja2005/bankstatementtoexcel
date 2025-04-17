import { Module } from "@nestjs/common";
import { LanguageModelModule } from "app/infrastructure/language-model";
import { ConvertToExcelUseCase } from "app/application/usecases/converter/convert-to-excel";
import { FileBuilderModule } from "app/infrastructure/file-builder/module";
import { TextExtractorModule } from "app/infrastructure/text-extractor/module";
import { ConverterController } from "src/application/api/controllers/converter";

@Module({
    imports: [LanguageModelModule, FileBuilderModule, TextExtractorModule],
    providers: [ConvertToExcelUseCase],
    controllers: [ConverterController],
})
export class ConverterModule {}
