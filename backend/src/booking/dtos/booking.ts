import { BookingStatus } from '@/booking/types';
import { convertToTimezone } from '@/utils/date';
import { ApiResponse, ApiResponseProperty } from '@nestjs/swagger';
import { Booking } from '@prisma/client';

export class BookingResponse {
  @ApiResponseProperty()
  startTime: string;

  @ApiResponseProperty()
  endTime: string;

  @ApiResponseProperty()
  identifier: string;

  @ApiResponseProperty()
  status: string;

  @ApiResponseProperty()
  createdAt: string;

  @ApiResponseProperty()
  email: string;

  constructor(obj: Partial<BookingResponse>) {
    Object.assign(this, obj);
  }

  static fromPrisma(booking: Booking): BookingResponse {
    return new BookingResponse({
      startTime: convertToTimezone(booking.startTime).toISOString(true),
      endTime: convertToTimezone(booking.endTime).toISOString(true),
      identifier: booking.identifier,
      email: booking.email,
      createdAt: convertToTimezone(booking.createdAt).toISOString(true),
      status: BookingStatus[booking.status].toLowerCase(),
    });
  }
}
