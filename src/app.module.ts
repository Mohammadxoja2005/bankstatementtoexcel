import {Module} from '@nestjs/common';
import {ConverterModule} from "./application/common/converter/module";

@Module({
    imports: [ConverterModule],
})
export class AppModule {
}
