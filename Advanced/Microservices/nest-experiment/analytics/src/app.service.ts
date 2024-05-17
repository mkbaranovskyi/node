import { Injectable } from '@nestjs/common'
import { interval, map, takeWhile } from 'rxjs'
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
    return interval(1000).pipe(
      takeWhile((count) => count <= 2),
      map((count) => count + 1)
    )
  }
}
