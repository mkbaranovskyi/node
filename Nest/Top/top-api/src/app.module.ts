import { Module } from '@nestjs/common';
import { AppController } from './app.controller'
import { AppService } from './app.service';
import { OneModule } from './one/one.module'

@Module({
  imports: [OneModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
