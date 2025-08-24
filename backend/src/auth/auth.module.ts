import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
      JwtModule.registerAsync({
          useFactory: () => ({
              global:true,
              secret: process.env.JWT_SECRET || 'default_secret',
              signOptions: { expiresIn: '1h' },
          }),
      }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
