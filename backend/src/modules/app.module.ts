import { Module, MiddlewareConsumer } from '@nestjs/common'
import { LoggerMiddleware } from '@middleware/logger.middleware'
import { UsersModule } from './users.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmModuleOptions } from '@database/database.providers'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth.module'
import { AppController } from '@controllers/app.controller'
import { ShopsModule } from './shops.module'
import { AppService } from '@services/app.service'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { WrapperInterceptor } from '@middleware/wrapper.interceptor'


@Module({
  
  imports: [
    
    // Глобальный конфиг
    ConfigModule.forRoot({
      isGlobal: true,
      //envFilePath: ['.env.development.local', '.env.development'],
    }),

    // Модуль БД
    TypeOrmModule.forRoot(typeOrmModuleOptions),

    // Модули
    UsersModule, 
    ShopsModule, 
    AuthModule, 

  ],

  providers: [ 
    AppService, 
    {
      provide: APP_INTERCEPTOR,
      useClass: WrapperInterceptor,
    },
  ],
  controllers: [AppController],
  exports: [],

})

export class AppModule {

  configure(consumer: MiddlewareConsumer) {
    
    consumer

      .apply(LoggerMiddleware)
      .forRoutes('users');
      
      // .exclude(
      //   { path: 'users', method: RequestMethod.GET },
      //   { path: 'users', method: RequestMethod.POST },
      //   'users/(.*)',
      // )
      // .forRoutes({ path: 'cats', method: RequestMethod.GET });
      // .forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
      // .forRoutes(UsersController);

      // consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);

      // Глобально main.ts
      // const app = await NestFactory.create(AppModule);
      // app.use(logger);
      // await app.listen(3000);


  }

}
