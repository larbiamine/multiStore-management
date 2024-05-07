import {Module} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MyConfigService } from './config.service';
@Module({
    providers: [MyConfigService],
    exports: [MyConfigService],
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
})

export class MyConfigModule {}