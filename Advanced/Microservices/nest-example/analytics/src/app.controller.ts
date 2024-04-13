import { Controller, Get } from '@nestjs/common'
import { EventPattern, MessagePattern } from '@nestjs/microservices'
import { AppService } from './app.service'
import { CreateUserEvent } from './events'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // This microservice is a hybrid microservice: it has both HTTP and microservice endpoints. So we can call it directly
  @Get('/hello')
  getHello(): string {
    return this.appService.getHello()
  }

  // And we can also call it via the microservice
  @EventPattern('user_created')
  async handleUserCreated(data: CreateUserEvent) {
    return this.appService.handleUserCreated(data)
  }

  @MessagePattern('get_analytics')
  getAnalytics() {
    return this.appService.getAnalytics()
  }
}
