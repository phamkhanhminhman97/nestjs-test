import { Injectable, ExecutionContext, CanActivate, ForbiddenException, createParamDecorator } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
// This should be used as guard class

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') {
  public constructor(private readonly reflector: Reflector) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic) {
      return true;
    }

    // Make sure to check the authorization, for now, just return false to have a difference between public routes.
    const parentCanActivate = (await super.canActivate(context)) as boolean;
    return parentCanActivate;
  }
}
// export const AuthGuard = NestAuthGuard('jwt');
export const AuthGuardOptional = NestAuthGuard(['jwt', 'anonymous']);

@Injectable()
export class OptionalJwtAuthGuard extends NestAuthGuard('jwt') {
  // Override handleRequest so it never throws an error
  handleRequest(err, user) {
    return user;
  }
}

@Injectable()
export class ApiKeyGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { headers } = request;

    if (headers['x-api-key'] !== process.env.API_KEY) {
      throw new ForbiddenException('Invalid token');
    }

    return true;
  }
}

export const DecodedToken = createParamDecorator(async (_data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const authHeader = request.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  try {
    const jwt = new JwtService();
    const decoded = jwt.verify(token, {
      secret: process.env.JWT_INVITE_SECRET_KEY,
    });
    return decoded;
  } catch (error) {
    return false;
  }
});
