import {Controller, Injectable, Post, Req, Res} from "@nestjs/common";

@Controller("converter")
export class ConverterController {
    constructor() {
    }

    @Post("convert_to_excel")
    async convertToExcel(
        @Req() request: Request,
        @Res() response: Response): Promise<void> {

        try {

        }catch(error) {

        }
    }
}