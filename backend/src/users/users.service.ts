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

  async findAll(currentUserId?: number): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.fullname', 'user.createdAt'])
      .orderBy('user.fullname', 'ASC');

    if (currentUserId) {
      queryBuilder.where('user.id != :currentUserId', { currentUserId });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
