import { ApiProperty } from '@nestjs/swagger';

export class ErrorApiResponse {
  @ApiProperty({
    description: 'SCREAMING_CASE error code that identifies the problem type',
  })
  code: string;
  @ApiProperty({
    description:
      'Short, human-readable summary of the problem. Should not change from occurrence to occurrence',
  })
  title?: string;
  @ApiProperty({
    description:
      'Extension that contains a list of individual errors. One of the possible applications is validation error',
  })
  errors?: ResponseError[];
}

export class ResponseError {
  @ApiProperty({ description: 'Field name' })
  field: string;
  @ApiProperty({
    description:
      'Human-readable explanation specific to this occurrence of the problem',
  })
  detail: string;
}
