import {Module} from "@nestjs/common";
import {ConverterController} from "../../api/converter";
import {ConvertToExcelUseCase} from "../../usecases/converter/convert-to-excel";

@Module({
    providers: [ConvertToExcelUseCase],
    controllers: [ConverterController]
})
export class ConverterModule {
}