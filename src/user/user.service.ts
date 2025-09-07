import { Injectable } from '@nestjs/common'

import { PrismaService } from '@/common/services/prisma.service'

import type { UserResponseType } from '@/user/dto/create-user.dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async getUserEntityById(id: string): Promise<UserResponseType> {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, templates: true },
    })
  }
}
