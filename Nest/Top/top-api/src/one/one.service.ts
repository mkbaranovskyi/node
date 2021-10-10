import { Injectable } from '@nestjs/common';
import { TwoService } from 'src/two/two.service'

@Injectable()
export class OneService {
  constructor(
    private readonly twoService: TwoService,
  ) {}

  one(){
    this.twoService.log()
    // console.log('one')
  }
}
