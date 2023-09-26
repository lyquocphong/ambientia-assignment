import { ReserveBookingDTO } from './dtos/reserve.dto';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma.service';
import * as moment from 'moment-timezone';
import { BookingSlot, BookingStatus } from '@/booking/types';
import { Service } from '@/entities';
import { getDefaultService } from '@/utils/service';
import { generateMomentFromIsoString, validateDateRange } from '@/utils/date';

@Injectable()
export class BookingService {
  private readonly logger = new Logger(BookingService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.booking.findMany({
      orderBy: [
        {
          startTime: 'asc',
        },
      ],
    });
  }

  async reserveBooking(reserveBookingDto: ReserveBookingDTO) {
    const service = getDefaultService();

    const { startTime, email } = reserveBookingDto;
    const { duration } = service;
    const startMoment = moment(startTime);
    const endMoment = startMoment.clone().add(duration, 'minute');

    const condition = {
      status: {
        not: BookingStatus.CANCELLED,
      },
    };

    const select = {
      identifier: true,
      status: true,
      email: true,
      startTime: true,
      endTime: true,
    };

    const slot = new BookingSlot(
      startMoment.toISOString(true),
      endMoment.toISOString(true),
    );

    const bookedSlots = await this.findInRange(
      startMoment,
      endMoment,
      select,
      condition,
    );

    const isValidSlot = service.isValidSlot(
      slot,
      bookedSlots.map((booking) => ({
        startTime: booking.startTime.toISOString(),
        endTime: booking.endTime.toISOString(),
      })),
    );

    if (isValidSlot === false) {
      throw new BadRequestException('Invalid slot');
    }

    const booking: Prisma.BookingCreateInput = {
      startTime: startMoment.toDate(),
      endTime: endMoment.toDate(),
      status: BookingStatus.RESERVE,
      email,
    };

    return await this.prisma.booking.create({
      data: booking,
    });
  }

  async findInRange(
    from: moment.Moment,
    to: moment.Moment,
    select?: Prisma.BookingSelect,
    condition?: Prisma.BookingWhereInput,
    orderBy?: Prisma.BookingOrderByWithAggregationInput,
  ) {
    return await this.prisma.booking.findMany({
      where: {
        startTime: {
          gte: from.clone().startOf('day').utc().toDate(),
          lte: to.clone().endOf('day').utc().toDate(),
        },
        ...(condition ?? {}),
      },
      select: select || {},
      orderBy: orderBy || [
        {
          startTime: 'asc',
        },
      ],
    });
  }

  async getAvailability(from: string, to: string) {
    const service = getDefaultService();

    const fromMoment = generateMomentFromIsoString(from).startOf('day');
    const toMoment = generateMomentFromIsoString(to).endOf('day');

    const condition = {
      status: {
        not: BookingStatus.CANCELLED,
      },
    };

    const select = {
      identifier: true,
      status: true,
      email: true,
      startTime: true,
      endTime: true,
    };

    let currentMoment = fromMoment;

    let availableSlots: BookingSlot[] = [];
    while (currentMoment.isSameOrBefore(toMoment, 'day')) {
      const dayOfWeek = currentMoment.weekday();
      const schedule = service.getSchedule(dayOfWeek);

      if (schedule?.enabled) {
        const bookedSlots = await this.findInRange(
          currentMoment,
          currentMoment,
          select,
          condition,
        );

        const availableSlotsInDay = service.getDayAvailableSlots(
          currentMoment,
          bookedSlots.map((booking) => ({
            startTime: booking.startTime.toISOString(),
            endTime: booking.endTime.toISOString(),
          })),
        );

        availableSlots = availableSlots.concat(availableSlotsInDay);
      }

      currentMoment = currentMoment.clone().add(1, 'day');
    }

    return availableSlots;
  }
}
