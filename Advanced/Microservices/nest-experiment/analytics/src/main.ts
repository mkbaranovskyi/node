import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Transport } from '@nestjs/microservices'

async function bootstrap() {
  // This is a hybrid app that both listens for HTTP requests and connects to a microservice.
  const app = await NestFactory.create(AppModule)
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 3002,
    },
  })
  await app.startAllMicroservices()
  await app.listen(3003)
}
bootstrap()
