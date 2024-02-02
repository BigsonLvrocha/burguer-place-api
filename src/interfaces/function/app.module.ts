import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { config } from '../../config.js';
import { HttpModule } from '../http/http.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => config],
    }),
    HttpModule,
  ],
})
export class AppModule {}
