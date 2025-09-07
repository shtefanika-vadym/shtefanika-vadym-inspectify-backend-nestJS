import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD, APP_PIPE } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler'

import { AppController } from '@/app.controller'
import { ImageModule } from '@/image/image.module'
import { ReportModule } from '@/report/report.module'
import { TemplateModule } from '@/template/template.module'

import { ThrottlerBehindProxyGuard } from '@/common/guards/throttler-behind-proxy.guard'
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe'

import { AuthModule } from '@/auth/auth.module'

import { UserModule } from '@/user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'long', // Least restrictive
        ttl: 60000, // 60 seconds window
        limit: 100, // 100 requests/minute
      },
    ]),
    AuthModule,
    UserModule,
    ImageModule,
    ReportModule,
    TemplateModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
