"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { BookMarked, CalendarX2, Clock } from "lucide-react";
import { Separator } from "./ui/separator";
import { createMeetingAction } from "@/actions/meeting";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { SubmitButton } from "./SubmitButton";
import { Button } from "./ui/button";

type EventType = {
  id: string;
  title: string;
  description: string;
  duration: number;
  videoCallSoftware: string;
  user: {
    image: string | null;
    name: string | null;
  };
};

type BookingFormProps = EventType & {
  username: string;
  formattedDate: string;
  date: string;
  time: string;
  eventName: string;
};

const BookingForm = ({
  id,
  title,
  description,
  duration,
  videoCallSoftware,
  user,
  username,
  formattedDate,
  date,
  time,
  eventName,
}: BookingFormProps) => {
  const router = useRouter();

  const handleCancel = () => {
    router.push(`/${username}/${eventName}?date=${date}`);
  };

  return (
    <Card className="max-w-[800px]">
      <CardContent className="p-5 grid md:grid-cols-[1fr_auto_1fr] gap-4">
        <div>
          <Image
            src={user.image as string}
            alt={`${user.name}'s profile picture`}
            className="size-9 rounded-full"
            width={30}
            height={30}
          />
          <p className="text-sm font-medium text-muted-foreground mt-1">
            {user.name}
          </p>
          <h1 className="text-xl font-semibold mt-2">{title}</h1>
          <p className="text-sm font-medium text-muted-foreground">
            {description}
          </p>

          <div className="mt-5 grid gap-y-3">
            <p className="flex items-center">
              <CalendarX2 className="size-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                {formattedDate}
              </span>
            </p>
            <p className="flex items-center">
              <Clock className="size-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                {duration} Mins
              </span>
            </p>
            <p className="flex items-center">
              <BookMarked className="size-4 mr-2 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                {videoCallSoftware}
              </span>
            </p>
          </div>
        </div>
        <Separator
          orientation="vertical"
          className="hidden md:block h-full w-[1px]"
        />

        <form className="flex flex-col gap-y-4" action={createMeetingAction}>
          <input type="hidden" name="eventTypeId" value={id} />
          <input type="hidden" name="username" value={username} />
          <input type="hidden" name="fromTime" value={time} />
          <input type="hidden" name="eventDate" value={date} />
          <input type="hidden" name="meetingLength" value={duration} />
          <div className="flex flex-col gap-y-2">
            <Label>Your Name</Label>
            <Input
              aria-required="true"
              name="name"
              placeholder="Your Name"
              required
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Your Email</Label>
            <Input
              name="email"
              type="email"
              aria-required="true"
              placeholder="johndoe@gmail.com"
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            />
          </div>

          <div className="flex gap-2">
            <SubmitButton text="Book Meeting" className="text-white" />
            <Button
              variant="secondary"
              className="text-white cursor-pointer"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
