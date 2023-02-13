import { BullModule } from "@nestjs/bull";
import { Module } from '@nestjs/common';
import { QueueController } from './queue.controller';
import { QueueProcessor } from '../shared/queues/queue.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audio',
      defaultJobOptions: {
        removeOnComplete: true,
        timeout: 2000,
        attempts: 4,
        backoff: {
          type: 'fixed',
          delay: 2000,
        },
      },
    }),
  ],
  controllers: [QueueController],
  providers: [QueueProcessor]
})
export class QueueModule { }
