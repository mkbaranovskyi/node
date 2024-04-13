import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'
import { EventPattern } from '@nestjs/microservices'
import { CreateUserEvent } from './events'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('user_created')
  async handleUserCreated(data: CreateUserEvent) {
    return this.appService.handleUserCreated(data)
  }
}
