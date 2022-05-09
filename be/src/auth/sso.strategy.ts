import { Strategy } from 'passport-custom';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Reflector } from '@nestjs/core';

const IS_PUBLIC = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC, true);

@Injectable()
export class SsoStrategy extends PassportStrategy(Strategy, 'sso') {
  constructor(private httpService: HttpService) {
    super();
  }

  async validate(request: any): Promise<any> {
    const at = request.cookies['at'];
    if (at) {
      return await firstValueFrom(
        this.httpService.get(process.env.GET_USER_URL, {
          headers: {
            Cookie: `at=${at};`,
          },
        }),
      )
        .then((res) => {
          return res.data;
        })
        .catch(() => {
          return false;
        });
    } else {
      return false;
    }
  }
}

@Injectable()
export class SsoAuthGuard extends AuthGuard('sso') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  public canActivate(context: ExecutionContext): any {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC,
      context.getHandler(),
    );
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
