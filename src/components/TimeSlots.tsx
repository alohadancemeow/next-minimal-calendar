import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { nylas } from "@/lib/nylas";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { calculateAvailableTimeSlots } from "@/helpers/calculate-time-slots";
import { format } from "date-fns";

interface iappProps {
  selectedDate: Date;
  userName: string;
  meetingDuration: number;
}

async function getAvailability(selectedDate: Date, userName: string) {
  const currentDay = format(selectedDate, "EEEE");

  const startOfDay = new Date(selectedDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(selectedDate);
  endOfDay.setHours(23, 59, 59, 999);

  const data = await prisma.availability.findFirst({
    where: {
      day: currentDay as Prisma.EnumDayFilter,
      User: {
        username: userName,
      },
    },
    select: {
      fromTime: true,
      tillTime: true,
      id: true,
      User: {
        select: {
          grantEmail: true,
          grantId: true,
        },
      },
    },
  });

  const nylasCalendarData = await nylas.calendars.getFreeBusy({
    identifier: data?.User.grantId as string,
    requestBody: {
      startTime: Math.floor(startOfDay.getTime() / 1000),
      endTime: Math.floor(endOfDay.getTime() / 1000),
      emails: [data?.User.grantEmail as string],
    },
  });

  return { data, nylasCalendarData };
}

export async function TimeSlots({
  selectedDate,
  userName,
  meetingDuration,
}: iappProps) {
  const { data, nylasCalendarData } = await getAvailability(
    selectedDate,
    userName
  );

  const dbAvailability = { fromTime: data?.fromTime, tillTime: data?.tillTime };
  const formattedDate = format(selectedDate, "yyyy-MM-dd");
  const availableSlots = calculateAvailableTimeSlots(
    dbAvailability,
    nylasCalendarData,
    formattedDate,
    meetingDuration
  );

  return (
    <div>
      <p className="text-base font-semibold">
        {format(selectedDate, "EEE")}.{" "}
        <span className="text-sm text-muted-foreground">
          {format(selectedDate, "MMM. d")}
        </span>
      </p>

      <div className="mt-3 max-h-[300px] overflow-y-auto scrollbar-hide">
        {availableSlots.length > 0 ? (
          availableSlots.map((slot, index) => (
            <Link
              key={index}
              href={`?date=${format(selectedDate, "yyyy-MM-dd")}&time=${slot}`}
            >
              <Button variant="outline" className="w-full mb-2 cursor-pointer">
                {slot}
              </Button>
            </Link>
          ))
        ) : (
          <p>No available time slots for this date.</p>
        )}
      </div>
    </div>
  );
}
