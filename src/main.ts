import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const PORT = `${process.env.PORT}` || 5000;
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.enableCors({
    origin: ['http://localhost:3000', 'https://shop-web-pied.vercel.app'],
    credentials: true,
    exposedHeaders: ['Set-Cookie'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  });
  await app.listen(PORT, () => console.log(`Server started on port=${PORT}`));
}
bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
});
