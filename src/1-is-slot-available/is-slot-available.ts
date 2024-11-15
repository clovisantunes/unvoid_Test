import { add } from 'lodash';
import { CalendarAvailability, CalendarSlot } from '../types';
import { getDay, addMinutes } from 'date-fns';

export const isSlotAvailable = (availability: CalendarAvailability, slot: CalendarSlot,): boolean => {
  const DayWeekslot = getDay(slot.start);

  const slotEnd = addMinutes(slot.start, slot.durationM);
  const slotStartTime = { hours: slot.start.getUTCHours(), minutes: slot.start.getUTCMinutes() };
  const slotEndTime = { hours: slotEnd.getUTCHours(), minutes: slotEnd.getUTCMinutes() };

  const availableForDay = availability.include.filter(a => a.weekday === DayWeekslot);

  return availableForDay.some(({ range }) => {
    const [start, end] = range;

    const isStartInRange =
      slotStartTime.hours > start.hours ||
      (slotStartTime.hours === start.hours && slotStartTime.minutes >= start.minutes);

    const isEndInRange =
      slotEndTime.hours < end.hours ||
      (slotEndTime.hours === end.hours && slotEndTime.minutes <= end.minutes);

      return isStartInRange && isEndInRange;
    });
};
