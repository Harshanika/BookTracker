import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        
        if (!token) {
          throw new UnauthorizedException();
        }
        
        try {
          // ✅ Decode JWT and attach user info to request
          const payload = await this.jwtService.verifyAsync(token);
          request.user = payload; // ✅ This gives you req.user.sub (user ID)
          return true;
        } catch {
          throw new UnauthorizedException();
        }
      }

      private extractTokenFromHeader(request: any): string | undefined {
        const authHeader = request.headers?.authorization || request.headers?.Authorization;
        if (!authHeader || typeof authHeader !== 'string') return undefined;
        const [type, token] = authHeader.split(' ');
        return type === 'Bearer' ? token : undefined;
      }
}