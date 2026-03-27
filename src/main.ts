import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Keep Render free tier alive — ping every 14 minutes
if (process.env.NODE_ENV === 'production') {
  const BACKEND_URL = process.env.RENDER_EXTERNAL_URL || '';
  if (BACKEND_URL) {
    setInterval(async () => {
      try {
        await fetch(`${BACKEND_URL}/health`);
      } catch {}
    }, 14 * 60 * 1000);
  }
}

  app.enableCors({
    origin: ['http://localhost:4200',
      'https://dev-pulse-fe.vercel.app/',
      /\.vercel\.app$ /,
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
