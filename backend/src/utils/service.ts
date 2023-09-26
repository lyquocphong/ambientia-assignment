import { Service, ServiceSchedule } from '@/entities';

/**
 * Get default service
 *
 * @return {Service}
 */
export const getDefaultService = (): Service => {
  return new Service('Body massage 50 mins', 100, 50, [
    new ServiceSchedule(0, true, '09:00', '17:00'),
    new ServiceSchedule(3, true, '09:00', '17:00'),
    new ServiceSchedule(4, true, '09:00', '17:00'),
  ]);
};
