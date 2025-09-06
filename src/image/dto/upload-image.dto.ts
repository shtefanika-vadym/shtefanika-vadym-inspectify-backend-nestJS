import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const UploadImageSchema = z.object({
  originalname: z
    .string()
    .regex(
      /\.(csv|xlsx|png|jpe?g|heic|webp)$/i,
      'Only .png, .jpg, .jpeg, .heic, or .webp files are allowed',
    ),
  mimetype: z.enum([
    'image/png', // PNG
    'image/jpeg', // JPEG
    'image/heic', // HEIC (iPhone photos)
    'image/webp', // WEBP
  ]),
  size: z.number().max(10 * 1024 * 1024), // max 10 MB
  buffer: z.instanceof(Buffer),
})

export class UploadImageDto extends createZodDto(UploadImageSchema) {}
