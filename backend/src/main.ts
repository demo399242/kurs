import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { HttpExceptionFilter } from './common/middleware/HTTP-exception.filter'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  
  app.useGlobalPipes(
    new ValidationPipe({ 
      disableErrorMessages: false,
      whitelist: true,
    }
  ));

  app.enableCors();

  await app.listen(3000);
  
}
bootstrap();
