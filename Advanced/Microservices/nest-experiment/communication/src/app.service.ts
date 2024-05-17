import { Injectable } from '@nestjs/common'
import { CreateUserEvent } from './events'

@Injectable()
export class AppService {
  handleUserCreated(data: CreateUserEvent) {
    console.log('Handle user created - COMMUNICATION', data)
    // Email the user and welcome them
  }
}
