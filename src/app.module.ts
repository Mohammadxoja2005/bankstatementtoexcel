import { Module } from "@nestjs/common";
import {
    TextExtractorModule,
    FileBuilderModule,
    LanguageModelModule,
    ConverterModule,
} from "app/application/common";

@Module({
    imports: [ConverterModule, TextExtractorModule, FileBuilderModule, LanguageModelModule],
})
export class AppModule {}
