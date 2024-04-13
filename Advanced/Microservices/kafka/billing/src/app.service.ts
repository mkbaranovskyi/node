import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { GetUserDto } from './dto';
import { OrderCreatedEvent } from './events';

@Injectable()
export class AppService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientKafka,
  ) {}

  handleOrderCreated(data: OrderCreatedEvent) {
    console.log('BILLING - handleOrderCreated - data:', data);

    // This is only actually getting send after we subscribe to the response
    this.authClient
      .send('get_user', new GetUserDto(data.userId))
      .subscribe((user) => {
        console.log(user);
        console.log(
          `Billing user with Stripe ID ${user.stripeId} a price of $${data.price}`,
        );
      });
  }
}
