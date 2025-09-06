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
              description: 'Lista completă a întrebărilor din secțiune, fiecare cu text și tip',
              items: {
                type: 'object',
                properties: {
                  question: {
                    type: 'string',
                    description: 'Textul exact al întrebării în limba română',
                  },
                  type: {
                    type: 'string',
                    enum: ['boolean', 'number', 'input'],
                    description:
                      'Tipul câmpului pentru UI: implicit boolean, number dacă întrebarea cere număr, input dacă răspunsul trebuie scris liber',
                  },
                },
                required: ['question', 'type'],
                additionalProperties: false,
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
