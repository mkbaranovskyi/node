import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController implements OnModuleInit {
  constructor(
    private readonly appService: AppService,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  // We add this to be able to get the response from the get_user topic. Previously we didn't care about the response
  onModuleInit() {
    this.authClient.subscribeToResponseOf('get_user');
  }

  @EventPattern('order_created')
  async handleOrderCreated(data: any) {
    return this.appService.handleOrderCreated(data);
  }
}
