import { Injectable } from '@nestjs/common';
import { OneService } from './one/one.service'

@Injectable()
export class AppService {
  constructor(
    private readonly oneService: OneService,
  ) {}
  
  count(){
    this.oneService.one()
  }
}
