import {Module} from '@nestjs/common';
import {InfrastructureModule} from "app/infrastructure/module";
import {ApplicationModule} from "app/application/module";

@Module({
    imports: [ApplicationModule, InfrastructureModule],
})
export class AppModule {
}
