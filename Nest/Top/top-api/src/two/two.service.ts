import { Injectable } from '@nestjs/common';

@Injectable()
export class TwoService {
  log(){
    console.log('two')
  }
}
