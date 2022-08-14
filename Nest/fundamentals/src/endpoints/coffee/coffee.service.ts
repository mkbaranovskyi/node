import { Injectable } from '@nestjs/common';
import { CoffeeEntity } from './entities';

@Injectable()
export class CoffeeService {
  private coffeeTypes: CoffeeEntity[] = [{
    id: 1,
    name: 'Simple latte',
    brand: 'Kharkiv',
    flavors: ['chocolate', 'vanilla'],
  }];
}
