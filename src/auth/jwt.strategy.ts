import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

import config from '@/config'
import { ExtractJwt, Strategy } from 'passport-jwt'

import type { AuthUser } from '@/auth/auth-user'
import { AuthService } from '@/auth/auth.service'
import type { JwtPayload } from '@/auth/jwt-payload'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secretOrKey,
    })
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.authService.validateUser(payload)
    if (!user) throw new UnauthorizedException()

    return user
  }
}
