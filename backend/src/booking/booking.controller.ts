import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { ApiTags } from '@nestjs/swagger';
import {
  GetAvailabilityQuery,
  GetAvailabilityResponse,
} from '@/booking/dtos/get-availability';
import { ReserveBookingDTO } from '@/booking/dtos/reserve.dto';
import { isValidRange } from '@/utils/date';
import { BookingResponse } from '@/booking/dtos/booking';
@Controller('booking')
@ApiTags('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Get()
  async getAll(): Promise<BookingResponse[]> {
    const bookings = await this.bookingService.getAll();
    return bookings.map((booking) => BookingResponse.fromPrisma(booking));
  }

  @Get('availability')
  async getAvailability(
    @Query() query: GetAvailabilityQuery,
  ): Promise<GetAvailabilityResponse> {
    const { from, to } = query;

    if (isValidRange(from, to) === false) {
      throw new BadRequestException('Invalid range');
    }

    const availableSlots = await this.bookingService.getAvailability(from, to);

    return new GetAvailabilityResponse(availableSlots);
  }

  @Post('reserve')
  async reserveBooking(
    @Body() reserveBookingDto: ReserveBookingDTO,
  ): Promise<BookingResponse> {
    const booking = await this.bookingService.reserveBooking(reserveBookingDto);
    return BookingResponse.fromPrisma(booking);
  }
}