import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { QueueModule } from './endpoints/queue.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    QueueModule,
  ],
})
export class AppModule { }
