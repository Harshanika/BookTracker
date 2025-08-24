import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization']; // Bearer <token>
        if (!authHeader) return false;
        const token = authHeader.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const user = this.jwtService.verify(token);
            request.user = user;
            return true;
        } catch (error) {
            console.error('JWT verification failed:', error);
            throw new UnauthorizedException();
            // return false;
        }
    }
}