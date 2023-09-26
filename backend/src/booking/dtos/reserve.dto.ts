import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsUUID } from 'class-validator';
import * as moment from 'moment-timezone';

export class ReserveBookingDTO {
  @IsDateString()
  @ApiProperty({ required: true, default: moment().toISOString() })
  startTime: string;

  @IsEmail()
  @ApiProperty({ required: true, default: 'abc@example.com' })
  email: string;
}

export class ReserveBookingResponse {
  @ApiResponseProperty({ example: 'abc@example.com' })
  @IsUUID()
  id: string;
}
