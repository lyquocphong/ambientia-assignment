import { BookingSlot } from '@/booking/types';
import {
  convertToTimezone,
  generateMomentFromIsoString,
  getDefaultTimezone,
  getInfoFromTimeString,
  isValidTimeString,
} from '@/utils/date';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import * as moment from 'moment-timezone';

export class ServiceSchedule {
  @ApiProperty()
  enabled: boolean;

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  dateOfWeek: number;

  constructor(dayOfWeek: number, enabled: boolean, from: string, to: string) {
    this.dateOfWeek = dayOfWeek;
    this.enabled = enabled;
    this.from = from;
    this.to = to;
  }

  validate(): boolean {
    if (this.dateOfWeek < 0 || this.dateOfWeek > 6) {
      throw new Error('Invalid day of the week');
    }

    if (!isValidTimeString(this.from) || !isValidTimeString(this.to)) {
      throw new Error('Invalid time string');
    }

    return true;
  }
}
export class Service {
  @ApiProperty()
  name: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  duration: number;

  @Type(() => ServiceSchedule)
  schedule: ServiceSchedule[];

  constructor(
    name: string,
    price: number,
    duration: number,
    schedule: ServiceSchedule[],
  ) {
    this.name = name;
    this.price = price;
    this.duration = duration;
    this.schedule = schedule;
  }
  getSchedule(dayOfWeek: number): ServiceSchedule | undefined {
    return this.schedule.find((schedule) => schedule.dateOfWeek === dayOfWeek);
  }

  private convertToDefaultTimezone(
    date: moment.Moment,
    time: string,
  ): moment.Moment {
    const defaultTimezone = getDefaultTimezone();
    const [hour, minute] = getInfoFromTimeString(time);
    return moment(date).tz(defaultTimezone).set({ hour, minute });
  }

  isOverlapsedSlot = (checkSlot: BookingSlot, bookedSlot: BookingSlot) => {
    const slotStartTime = generateMomentFromIsoString(checkSlot.startTime);
    const slotEndTime = generateMomentFromIsoString(checkSlot.endTime);

    const bookingStartTime = generateMomentFromIsoString(bookedSlot.startTime);
    const bookingEndTime = generateMomentFromIsoString(bookedSlot.endTime);

    if (
      slotEndTime.isSameOrBefore(bookingStartTime) ||
      slotStartTime.isSameOrAfter(bookingEndTime)
    ) {
      return false;
    }

    return true;
  };

  getDayAvailableSlots(
    date: moment.Moment,
    bookedSlots: BookingSlot[],
  ): BookingSlot[] {
    const dayOfWeek = date.weekday();
    const schedule = this.getSchedule(dayOfWeek);

    if (!schedule || !schedule.enabled) {
      return [];
    }

    const openingTime = this.convertToDefaultTimezone(date, schedule.from);
    const closingTime = this.convertToDefaultTimezone(date, schedule.to);

    // Sort booked slots by start time
    const sortedBooking = bookedSlots
      .slice()
      .sort((a, b) =>
        moment(a.startTime).isBefore(moment(b.startTime)) ? -1 : 1,
      );

    const availableSlots: BookingSlot[] = [];

    let currentTime = openingTime.clone();
    let validBookedSlots: BookingSlot[] = sortedBooking;
    let nextValidBookedSlots: BookingSlot[] = [];

    while (currentTime.isBefore(closingTime)) {
      // Calculate the end time of the slot
      const slotEndTime = currentTime.clone().add(this.duration, 'minutes');

      const slot = new BookingSlot(
        convertToTimezone(currentTime.toDate()).toISOString(true),
        convertToTimezone(slotEndTime.toDate()).toISOString(true),
      );

      if (nextValidBookedSlots.length > 0) {
        validBookedSlots = nextValidBookedSlots;
        nextValidBookedSlots = [];
      }

      let isOverlapsedSlot = false;
      if (validBookedSlots.length > 0) {
        for (const booking of validBookedSlots) {
          const bookingStartTime = generateMomentFromIsoString(
            booking.startTime,
          );
          const bookingEndTime = generateMomentFromIsoString(booking.endTime);

          // Add booking still valid to be checked next time
          if (bookingStartTime.isSameOrAfter(slotEndTime)) {
            nextValidBookedSlots.push(booking);
          }

          isOverlapsedSlot = this.isOverlapsedSlot(slot, booking);

          if (isOverlapsedSlot) {
            currentTime = bookingEndTime.clone();
            break;
          }
        }
      }

      if (!isOverlapsedSlot) {
        availableSlots.push(slot);
        currentTime = currentTime.clone().add(this.duration, 'minutes');
      }
    }

    return availableSlots;
  }
}
