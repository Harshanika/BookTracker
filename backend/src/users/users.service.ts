import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  findOne(id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }
}
