import { Module } from "@nestjs/common";
import { ConverterModule } from "app/application/common/converter";

@Module({
    imports: [ConverterModule],
})
export class ApplicationModule {}
