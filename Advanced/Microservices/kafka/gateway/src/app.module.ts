import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register({
      clients: [
        {
          name: 'BILLING_SERVICE',
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers: ['localhost:9092'],
              clientId: 'biling',
            },
            consumer: {
              groupId: 'billing-consumer',
            },
          },
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
