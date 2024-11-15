import { CalendarAvailability, CalendarEvent, CalendarSlot } from '../types';

export const isSlotAvailableWithBuffer = (
  availability: CalendarAvailability,
  events: Array<CalendarEvent>,
  slot: CalendarSlot,
): boolean => {
  const slotStart = slot.start.getTime();
  const slotEnd = slot.start.getTime() + slot.durationM * 60 * 1000;

  const isWithAvailability = (): boolean => {
    const slotDay = slot.start.getDay();
    const dayAvailability = availability.include.find((a) => a.weekday === slotDay);

    if(!dayAvailability) {
      return false;
    }
    const [startRange, endRange] = dayAvailability.range;
    const avaibilityStart = new Date(slot.start);
    avaibilityStart.setHours(startRange.hours, startRange.minutes, 0, 0);
    const avaibilityEnd = new Date(slot.start);
    avaibilityEnd.setHours(endRange.hours, endRange.minutes, 0, 0);

    return slotStart >= avaibilityStart.getTime() && slotEnd <= avaibilityEnd.getTime();
 
  }
  const hasConflictWithEvents = (): boolean => {
    return events.some(event => {
      const eventStart = event.start.getTime();
      const eventEnd = event.end.getTime();
      const bufferBefore = (event.buffer?.before || 0)* 30 * 60 * 1000;
      const bufferAfter = (event.buffer?.after || 0) * 60 * 1000;

      const eventBufferedStart = eventStart - bufferBefore;
      const eventBufferedEnd = eventEnd + bufferAfter;

      return !(slotEnd <= eventBufferedStart || slotStart >= eventBufferedEnd);
    });
  };
  return isWithAvailability() && !hasConflictWithEvents();
};
