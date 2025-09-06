import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthenticatedRequest } from '../dashboard/interfaces/authenticated.request';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('all')
  getAllUsers(@Req() req: AuthenticatedRequest) {
    return this.usersService.findAll(req.user.sub);
  }

  @Get(':id')
  getUser(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }
}
