import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AllExceptionsFilter } from './all-exceptions.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(), {
        logger: WinstonModule.createLogger({
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.colorize(),
                        winston.format.simple()
                    ),
                }),
                new winston.transports.File({
                    filename: 'logs/app.log',
                    format: winston.format.combine(
                        winston.format.timestamp(),
                        winston.format.json()
                    ),
                }),
                new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
                new winston.transports.File({ filename: 'logs/combined.log' }),
            ],
        }),
    });
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.listen(4000);
    console.log('Backend running on port 4000');
}
bootstrap();