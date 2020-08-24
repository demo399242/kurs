import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, HttpStatus } from '@nestjs/common';
import { jwtConstants } from './constants';
import { IAuthUser } from '../../interfaces/auth-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(authUser: IAuthUser): Promise<IAuthUser> {
    return { 
      userId: authUser.userId, 
      phone: authUser.phone, 
      roles: authUser.roles 
    };
  }

}