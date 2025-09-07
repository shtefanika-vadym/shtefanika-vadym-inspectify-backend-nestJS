import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const UploadTemplateSchema = z.object({
  originalname: z.string().regex(/\.(xlsx|csv)$/i, 'Only .xlsx or .csv files are allowed'),
  mimetype: z.enum([
    'text/csv', // CSV
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
  ]),
  size: z.number().max(10 * 1024 * 1024), // max 10 MB
  buffer: z.instanceof(Buffer),
})

export class UploadTemplateDto extends createZodDto(UploadTemplateSchema) {}
