import {
  addMinutes,
  format,
  fromUnixTime,
  isAfter,
  isBefore,
  parse,
} from "date-fns";
import { GetFreeBusyResponse, NylasResponse } from "nylas";

export function calculateAvailableTimeSlots(
  dbAvailability: {
    fromTime: string | undefined;
    tillTime: string | undefined;
  },
  nylasData: NylasResponse<GetFreeBusyResponse[]>,
  date: string,
  duration: number
) {
  const now = new Date(); // Get the current time

  // Convert DB availability to Date objects
  const availableFrom = parse(
    `${date} ${dbAvailability.fromTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );
  const availableTill = parse(
    `${date} ${dbAvailability.tillTime}`,
    "yyyy-MM-dd HH:mm",
    new Date()
  );

  // console.log(nylasData, "nylasData");

  // Extract busy slots from Nylas data
  // @ts-expect-error - TODO: fix this
  const busySlots = nylasData.data[0].timeSlots.map(
    (slot: { startTime: number; endTime: number }) => ({
      start: fromUnixTime(slot.startTime),
      end: fromUnixTime(slot.endTime),
    })
  );

  // Generate all possible 30-minute slots within the available time
  const allSlots = [];
  let currentSlot = availableFrom;
  
  while (isBefore(currentSlot, availableTill)) {
    allSlots.push(currentSlot);
    currentSlot = addMinutes(currentSlot, duration);
  }

  // Filter out busy slots and slots before the current time
  const freeSlots = allSlots.filter((slot) => {
    const slotEnd = addMinutes(slot, duration);
    
    return (
      isAfter(slot, now) && // Ensure the slot is after the current time
      !busySlots.some(
        (busy: { start: Date; end: Date }) =>
          (!isBefore(slot, busy.start) && isBefore(slot, busy.end)) ||
          (isAfter(slotEnd, busy.start) && !isAfter(slotEnd, busy.end)) ||
          (isBefore(slot, busy.start) && isAfter(slotEnd, busy.end))
      )
    );
  });

  // Format the free slots
  return freeSlots.map((slot) => format(slot, "HH:mm"));
}
