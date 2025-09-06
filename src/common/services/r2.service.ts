import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import type { Readable } from 'stream'

export type BucketType = 'templates' | 'reports' | 'images'

@Injectable()
export class R2Service {
  private s3Client: S3Client
  private readonly endpoint: string

  constructor(private readonly configService: ConfigService) {
    this.endpoint = this.configService.getOrThrow<string>('R2_ENDPOINT')

    this.s3Client = new S3Client({
      region: 'auto',
      endpoint: this.endpoint,
      credentials: {
        accessKeyId: this.configService.get<string>('R2_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>('R2_SECRET_ACCESS_KEY'),
      },
      forcePathStyle: true,
    })
  }

  private getFileExtension(filename: string): string {
    const parts = filename.split('.')
    return parts.length > 1 ? parts.pop().toLowerCase() : ''
  }

  async getFile(key: string, bucket: BucketType): Promise<Buffer> {
    const command = new GetObjectCommand({
      Key: key,
      Bucket: bucket,
    })
    const response = await this.s3Client.send(command)
    const stream = response.Body as Readable
    const chunks: Buffer[] = []
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
    return Buffer.concat(chunks)
  }

  async uploadFile(userId: string, file: Express.Multer.File, bucket: BucketType): Promise<string> {
    const fileExtension = this.getFileExtension(file.originalname)
    const key = `${userId}/${Date.now()}.${fileExtension}`

    const command = new PutObjectCommand({
      Key: key,
      Bucket: bucket,
      Body: file.buffer,
    })
    await this.s3Client.send(command)
    return `${this.endpoint}/${bucket}/${key}`
  }

  async removeFile(key: string, bucket: BucketType): Promise<void> {
    const command = new DeleteObjectCommand({
      Key: key,
      Bucket: bucket,
    })
    await this.s3Client.send(command)
  }
}
