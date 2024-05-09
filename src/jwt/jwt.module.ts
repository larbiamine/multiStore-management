import { Module } from '@nestjs/common';
import { MyJwtService } from './jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { MyConfigModule } from 'src/config/config.module';
import { MyConfigService } from 'src/config/config.service';


const registerAsync = {
  imports: [MyConfigModule],
  useFactory: async (configService: MyConfigService) => ({
    secret: configService.getJWTKey(),
    signOptions: { expiresIn: '3d' },
  }),
  inject: [MyConfigService],
};

@Module({
  imports: [ JwtModule.registerAsync(registerAsync)],
  providers: [MyJwtService],
  exports: [MyJwtService],
  
})
export class MyJwtModule {}
