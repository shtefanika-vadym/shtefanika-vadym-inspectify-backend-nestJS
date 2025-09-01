import { Injectable } from '@nestjs/common'

import * as crypto from 'crypto'

@Injectable()
export class Md5Service {
  toMd5(input: Buffer | string): string {
    return crypto.createHash('md5').update(input).digest('hex')
  }
}
