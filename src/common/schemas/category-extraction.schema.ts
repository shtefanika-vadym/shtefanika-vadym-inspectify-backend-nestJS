export const CategoryExtractionSchema = {
  name: 'CategoryExtractionSchema',
  schema: {
    type: 'object',
    properties: {
      result: {
        type: 'array',
        description: 'Lista secțiunilor și întrebărilor extrase din document',
        items: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'Titlul secțiunii (în limba română, conform regulilor de extragere)',
            },
            questions: {
              type: 'array',
              description: 'Lista completă a întrebărilor din secțiune',
              items: {
                type: 'string',
              },
            },
          },
          required: ['title', 'questions'],
          additionalProperties: false,
        },
      },
    },
    required: ['result'],
    additionalProperties: false,
  },
  strict: true,
}
