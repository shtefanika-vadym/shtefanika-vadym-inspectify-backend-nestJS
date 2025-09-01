import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import OpenAI from 'openai'

import { CategoryExtractionSchema } from '@/common/schemas/category-extraction.schema'

@Injectable()
export class OpenAIService {
  private readonly client: OpenAI
  private readonly categoryExtractionPrompt: string

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_KEY'),
    })
    this.categoryExtractionPrompt = this.configService.get<string>('CATEGORY_EXTRACTION_PROMPT')
  }

  async extractTemplateCategories(content: string) {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4.1',
      response_format: { type: 'json_schema', json_schema: CategoryExtractionSchema },
      messages: [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: this.categoryExtractionPrompt,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: content,
            },
          ],
        },
      ],
    })

    return JSON.parse(response.choices[0].message.content)?.result ?? []
  }
}
