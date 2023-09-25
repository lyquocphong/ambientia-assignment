import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsDateString, IsUUID } from 'class-validator';

export class ReserveBookingDTO {
  @IsDateString()
  @ApiProperty({ required: true, default: 'abc@example.com' })
  startTime: string;
}

export class ReserveBookingResponse {
  @ApiResponseProperty({ example: 'abc@example.com' })
  @IsUUID()
  id: string;
}
