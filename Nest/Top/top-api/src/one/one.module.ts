import { Module } from '@nestjs/common'
import { OneService } from './one.service';
import { TwoService } from 'src/two/two.service'

@Module({
  imports: [],
  providers: [OneService, TwoService],
  exports: [OneService],
})
export class OneModule {}