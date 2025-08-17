import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { BooksModule } from "./books/books.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { LendingModule } from "./lending/lending.module";
import { DashboardModule } from "./dashboard/dashboard.module";

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }), // Loads .env
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: 'db', // Use 'db' as the service name in Docker
                port: 5432,
                username: config.get('DB_USER'),
                password: config.get('DB_PASSWORD'),
                database: config.get('DB_NAME'),
                autoLoadEntities: true,
                synchronize: true,
            }),
        }),
        BooksModule, AuthModule, UsersModule, LendingModule, DashboardModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
