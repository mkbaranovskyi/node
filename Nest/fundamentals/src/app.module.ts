import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeeModule } from './endpoints/coffee/coffee.module';
import { LoggerMiddleware } from './shared/middleware';

@Module({
  imports: [
    CoffeeModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pass',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true, // TODO: set to false in production!
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      method: RequestMethod.ALL,
      path: '*',
    });
  }
}
