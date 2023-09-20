import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from '@/utils/env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration global
      validate,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
