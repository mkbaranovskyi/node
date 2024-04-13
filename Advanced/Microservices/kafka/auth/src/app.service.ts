import { Injectable } from '@nestjs/common';
import { GetUserDto } from './dto';

@Injectable()
export class AppService {
  private readonly users = [
    {
      userId: '123',
      stripeId: '45526',
    },
    {
      userId: '456',
      stripeId: '99384',
    },
  ];

  getUser(data: GetUserDto) {
    console.log('AUTH - getUser. Data: ', data.userId);

    return this.users.find((user) => user.userId === data.userId);
  }
}
