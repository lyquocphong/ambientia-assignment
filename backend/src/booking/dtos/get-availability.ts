import { BookingSlot } from '@/booking/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';
import * as moment from 'moment-timezone';

export class GetAvailabilityQuery {
  @IsDateString()
  @ApiProperty({
    required: true,
    default: moment().seconds(0).toISOString(true),
  })
  from: string;

  @IsDateString()
  @ApiProperty({
    required: true,
    default: moment().millisecond(0).toISOString(true),
  })
  to: string;
}

export class GetAvailabilityResponse {
  @ApiProperty({
    type: [BookingSlot],
  })
  slots: BookingSlot[];

  constructor(slots: BookingSlot[]) {
    this.slots = slots;
  }
}
