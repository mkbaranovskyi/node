import { Global, Module } from '@nestjs/common';
import { TwoService } from './two.service';

@Module({
  providers: [TwoService],
  imports: [TwoService],
})
export class TwoModule {}
