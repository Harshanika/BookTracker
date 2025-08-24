import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Book } from "../books/book.entity";
import { Repository } from "typeorm";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}
  private users: User[] = [];

  findOne(id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }
}
