import { Injectable } from '@nestjs/common'
import { ThrottlerGuard } from '@nestjs/throttler'

import * as requestIp from 'request-ip'

@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  // @ts-expect-error: third-party types are incorrect
  protected getTracker(req: Record<string, unknown>): string {
    return requestIp.getClientIp(req as unknown as requestIp.Request) ?? 'null-ip'
  }
}
