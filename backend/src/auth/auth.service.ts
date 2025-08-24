import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService, // <-- Add this line
    ) {}

    async register(dto: { fullname: string; email: string; password: string }) {
        const hash = await bcrypt.hash(dto.password, 10);
        const user = this.userRepository.create({
            fullname: dto.fullname,
            email: dto.email,
            passwordHash: hash,
        });
        await this.userRepository.save(user);
        return { message: 'User registered', ...dto, password: hash };
    }

    async login(dto: { email: string; password: string }) {
        const user = await this.userRepository.findOne({ where: { email: dto.email } });
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { sub: user.id, email: user.email,  fullname : user.fullname, };
        const token = await this.jwtService.signAsync(payload);
        return {
            message: 'Login success',
            access_token: token,
            user: payload
        };
    }
}