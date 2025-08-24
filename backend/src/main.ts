import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AllExceptionsFilter } from './all-exceptions.filter';
import DailyRotateFile from 'winston-daily-rotate-file';
import { RequestMethod } from '@nestjs/common'; // Add this import


const dailyRotateFileTransport = new DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
});
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
                // new winston.transports.File({ filename: 'logs/combined.log' }),
                dailyRotateFileTransport,
            ],
        }),
    });
    app.useGlobalFilters(new AllExceptionsFilter());
    app.enableCors({
        origin: "http://localhost:3000", // React port
        credentials: true,
    });
    app.setGlobalPrefix('api', {
        exclude: [
            { path: 'auth/login', method: RequestMethod.POST },
            { path: 'auth/register', method: RequestMethod.POST },
            { path: 'auth/me', method: RequestMethod.GET },
        ],
    });
    await app.listen(4000);
    console.log('Backend running on port 4000');
}
bootstrap();