import { Inject, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto'
import { ClientProxy } from '@nestjs/microservices'
import { CreateUserEvent } from './events/create-user.event'

@Injectable()
export class AppService {
  private readonly users: any[] = []

  constructor(
    @Inject('COMMUNICATION') private readonly communicationClient: ClientProxy,
    @Inject('ANALYTICS') private readonly analyticsClient: ClientProxy
  ) {}

  async createUser(dto: CreateUserDto) {
    this.users.push(dto)
    this.communicationClient.emit('user_created', new CreateUserEvent(dto.email))
    this.analyticsClient.emit('user_created', new CreateUserEvent(dto.email))
  }

  getAnalytics() {
    console.log('Get analytics - BACKEND')
    // This returns a "cold observable": it will only start emitting values when you subscribe to it. Nest subscribes to it for you.
    return this.analyticsClient.send('get_analytics', {})
  }
}
