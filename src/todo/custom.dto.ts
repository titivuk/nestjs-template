import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, ValidateNested } from 'class-validator';

export class CustomInnerDto {
  @ApiProperty()
  @IsString()
  b!: string;
}

export class CustomDto {
  @IsInt()
  a!: number;

  @ApiProperty({ type: CustomInnerDto })
  @ValidateNested()
  @Type(() => CustomInnerDto)
  inner!: CustomInnerDto;
}
