import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('api')
  getApi(): { message: string } {
    return { message: 'Backend is running no more  !' };
  }
}
