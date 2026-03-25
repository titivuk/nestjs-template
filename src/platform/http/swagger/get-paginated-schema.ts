import { getSchemaPath } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../pagination/paginated-result.dto';

export function getPaginatedSchema(dto: Parameters<typeof getSchemaPath>[0]) {
  return {
    allOf: [
      { $ref: getSchemaPath(PaginatedResponseDto) },
      {
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(dto) },
          },
        },
      },
    ],
  };
}
