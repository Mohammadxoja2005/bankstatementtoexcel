import {Controller, Post, Req, Res} from "@nestjs/common";
import {ConvertToExcelUseCase} from "../../usecases/converter/convert-to-excel";

@Controller("converter")
export class ConverterController {
    constructor(private readonly convertToExcelUseCase: ConvertToExcelUseCase) {
    }

    @Post("convert_to_excel")
    async convertToExcel(
        @Req() request: Request,
        @Res() response: Response
    ): Promise<void> {
        try {

        } catch (error) {

        }
    }
}