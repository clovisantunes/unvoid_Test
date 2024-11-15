import { addMinutes, getDay } from 'date-fns';
import { CalendarAvailability, CalendarEvent, CalendarSlot } from '../types';

export const isSlotAvailableWithEvents = (
  availability: CalendarAvailability,
  events: Array<Omit<CalendarEvent, 'buffer'>>,
  slot: CalendarSlot,
): boolean => {
   const slotWeekDay = getDay(slot.start);
   const slotEnd = addMinutes(slot.start, slot.durationM);

   const slotStartTime = { hours: slot.start.getUTCHours(), minutes: slot.start.getUTCMinutes() };
   const slotEndTime = { hours: slotEnd.getUTCHours(), minutes: slotEnd.getUTCMinutes() };

  const availableForDay = availability.include.filter(a => a.weekday === slotWeekDay);

  const isWithAvailability = availableForDay.some(({ range }) => {
    const [start, end] = range;

    const isStartInRange =
      slotStartTime.hours > start.hours ||
      (slotStartTime.hours === start.hours && slotStartTime.minutes >= start.minutes);

    const isEndInRange =
      slotEndTime.hours < end.hours ||
      (slotEndTime.hours === end.hours && slotEndTime.minutes <= end.minutes);

    return isStartInRange && isEndInRange;
});
    if (!isWithAvailability) {
      return false;
    }
    


    const isOverlapping = events.some(event => {
      const eventStart = event.start;
      const eventEnd = event.end;

      return (
        (slot.start >= eventStart && slot.start < eventEnd) ||
        (slotEnd > eventStart && slotEnd <= eventEnd) ||
        (slot.start <= eventStart && slotEnd >= eventEnd)
      );
  });

  return !isOverlapping;
};
