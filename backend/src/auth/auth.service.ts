import { Injectable } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  async register(dto: { name: string; email: string; password: string }) {
    // save user to DB later
    const hash = ''; //await bcrypt.hash(dto.password, 10);
    return { message: 'User registered', ...dto, password: hash };
  }

  async login(dto: { email: string; password: string }) {
    // verify user from DB later
    return { message: 'Login success (fake JWT here)' };
  }
}
