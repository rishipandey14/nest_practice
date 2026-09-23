import './instrument';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { httpLoggerMiddleware } from './config/logger.config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        bufferLogs: true,
    });
    app.useLogger(app.get(Logger));

    app.use(httpLoggerMiddleware);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );
    await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap().catch((error) => {
    console.error('Application failed to start:', error);
    process.exit(1);
});
