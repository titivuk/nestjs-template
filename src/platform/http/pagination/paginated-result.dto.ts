import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResult } from '@platform/pagination/paginated-result';
import { Pagination } from '@platform/pagination/pagination';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

/**
 * DTO wrappers for Controllers. Provides
 * - validation
 * - openapi gen
 */

export class PaginatedResponseDto<T = unknown> implements PaginatedResult<T> {
  @ApiProperty({ minimum: 1 })
  page!: number;

  @ApiProperty({ minimum: 1 })
  perPage!: number;

  total!: number;

  totalPages!: number;

  @ApiProperty({ isArray: true })
  data!: T[];
}

export class PaginationDto implements Pagination {
  @ApiProperty({ minimum: 1, description: 'Current page number' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @ApiProperty({ minimum: 1, description: 'Number of elements per page' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  perPage: number = 20;
}
