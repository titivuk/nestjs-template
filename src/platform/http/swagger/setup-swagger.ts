import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorApiResponse } from '../error-api-response.dto';
import {
  PaginatedResponseDto,
  PaginationDto,
} from '../pagination/paginated-result.dto';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Todo AI')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [PaginatedResponseDto, PaginationDto, ErrorApiResponse],
  });
  SwaggerModule.setup('docs', app, document);
}
