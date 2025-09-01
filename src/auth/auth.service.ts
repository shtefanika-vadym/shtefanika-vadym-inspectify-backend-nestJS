import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import * as bcrypt from 'bcrypt'

import { Prisma } from 'generated/prisma'

import { PrismaService } from '@/common/services/prisma.service'

import type { AuthUser } from '@/auth/auth-user'
import type { LoginDto } from '@/auth/dto/login.dto'
import type { SignupDto } from '@/auth/dto/signup.dto'
import type { JwtPayload } from '@/auth/jwt-payload'

import { UserService } from '@/user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupRequest: SignupDto): Promise<void> {
    try {
      await this.prisma.user.create({
        data: {
          name: signupRequest.name.toLowerCase(),
          email: signupRequest.email.toLowerCase(),
          passwordHash: await bcrypt.hash(signupRequest.password, 10),
        },
      })
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Username or email already exists')
      }
      throw error
    }
  }

  async validateUser(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.id },
    })

    if (user !== null && user.email === payload.email) return user

    throw new UnauthorizedException()
  }

  async login(loginRequest: LoginDto): Promise<string> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: loginRequest.email,
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
      },
    })

    if (user === null || !bcrypt.compareSync(loginRequest.password, user.passwordHash)) {
      throw new UnauthorizedException()
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    }

    return this.jwtService.signAsync(payload)
  }
}
