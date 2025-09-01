import { VersioningType, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from '@/app.module'
import helmet from 'helmet'
import { patchNestJsSwagger } from 'nestjs-zod'
import * as requestIp from 'request-ip'

async function bootstrap() {
  const logger = new Logger('Bootstrap')
  patchNestJsSwagger()

  const app = await NestFactory.create(AppModule)

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  })

  app.use(requestIp.mw())

  // Middleware against known security vulnerabilities
  app.use(helmet())

  const config = new DocumentBuilder()
    .setTitle('Inspectify API')
    .setDescription('The Inspectify API list of endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const configService = app.get(ConfigService)
  const port = configService.get<number>('PORT') ?? 3000
  await app.listen(port)

  logger.log(`Application is running on PORT: ${port}`)
}

bootstrap()
