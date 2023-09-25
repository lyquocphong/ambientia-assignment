import { ApiProperty } from '@nestjs/swagger';

export enum BookingStatus {
  RESERVE = 0,
  CONFIRMED = 1,
  CANCELLED = 2,
}

export class BookingSlot {
  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  constructor(startTime: string, endTime: string) {
    this.startTime = startTime;
    this.endTime = endTime;
  }
}
