import { CalendarAvailability, CalendarEvent, CalendarSlot } from '../types';

export const listAvailable30MinuteSlots = (
  availability: CalendarAvailability,
  events: Array<CalendarEvent>,
  range: [Date, Date],
): Array<CalendarSlot> => {
  const [rangeStart, rangeEnd] = range;
  const generateSlots = (): Array<CalendarSlot> => {
    const slots: Array<CalendarSlot> = [];
    let currentTime = new Date(rangeStart);

    while (currentTime < rangeEnd) {
      slots.push({
        start: new Date(currentTime),
        durationM: 30,
      });
      currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000); 
    }

    return slots;
  };

  const isSlotAvailable = (slot: CalendarSlot): boolean => {
    const slotStart = slot.start.getTime();
    const slotEnd = slotStart + slot.durationM * 60 * 1000;

    const isWithinAvailability = availability.include.some(({ weekday, range }) => {
      const slotWeekday = slot.start.getDay();
      if (slotWeekday !== weekday) return false;

      const [startRange, endRange] = range;
      const availabilityStart = new Date(slot.start);
      availabilityStart.setHours(startRange.hours, startRange.minutes, 0, 0);

      const availabilityEnd = new Date(slot.start);
      availabilityEnd.setHours(endRange.hours, endRange.minutes, 0, 0);

      return slotStart >= availabilityStart.getTime() && slotEnd <= availabilityEnd.getTime();
    });

    if (!isWithinAvailability) return false;

    const hasConflictWithEvents = events.some(event => {
      const eventStart = event.start.getTime();
      const eventEnd = event.end.getTime();
      const bufferBefore = (event.buffer?.before || 0) * 60 * 1000;
      const bufferAfter = (event.buffer?.after || 0) * 60 * 1000;

      const eventBufferedStart = eventStart - bufferBefore;
      const eventBufferedEnd = eventEnd + bufferAfter;

      return !(slotEnd <= eventBufferedStart || slotStart >= eventBufferedEnd);
    });

    return !hasConflictWithEvents;
  };

  const allSlots = generateSlots();

  const availableSlots = allSlots.filter(isSlotAvailable);

  return availableSlots;
};
