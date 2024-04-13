import { Injectable } from '@nestjs/common'
import { CreateUserEvent } from './events'

@Injectable()
export class AppService {
  private readonly analytics: any[] = []

  getHello() {
    return 'Hello World!'
  }

  handleUserCreated(data: CreateUserEvent) {
    this.analytics.push({
      email: data.email,
      date: new Date(),
    })
  }

  getAnalytics() {
    return this.analytics
  }
}
