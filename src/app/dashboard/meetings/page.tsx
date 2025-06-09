import { cancelMeetingAction } from "@/actions/meeting";
import { nylas } from "@/lib/nylas";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { NylasResponse } from "nylas";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format, fromUnixTime } from "date-fns";
import { Video } from "lucide-react";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { SubmitButton } from "@/components/SubmitButton";
import { redirect } from "next/navigation";

interface NylasEvent {
  id: string;
  title: string;
  when: {
    startTime: number;
    endTime: number;
  };
  conferencing?: {
    details?: {
      url: string;
    };
  };
  participants: Array<{
    name: string;
    email: string;
  }>;
}

async function getData(userId: string) {
  const userData = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      grantId: true,
      grantEmail: true,
    },
  });

  if (!userData?.grantId || !userData?.grantEmail) {
    redirect("/dashboard");
    // throw new Error("User not found or not connected to calendar");
  }

  const { grantId, grantEmail } = userData;

  const data = (await nylas.events.list({
    identifier: grantId,
    queryParams: {
      calendarId: grantEmail,
    },
  })) as NylasResponse<NylasEvent[]>;

  return data;
}

const MeetingsPage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <EmptyState
        title="Not authenticated"
        description="Please sign in to view your meetings."
        buttonText="Sign in"
        href="/api/auth/signin"
      />
    );
  }

  const data = await getData(session.user.id);
  console.log(data, "data");

  // console.log(data.data[0].when, "data");
  // console.log(data.data, "participants");

  return (
    <>
      {data.data.length < 1 ? (
        <EmptyState
          title="No meetings found"
          description="You don't have any meetings yet."
          buttonText="Create a new event type"
          href="/dashboard/new"
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>
              See upcoming and past events booked through your event type links.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.data.map((item) => (
              <form key={item.id} action={cancelMeetingAction}>
                <input type="hidden" name="eventId" value={item.id} />
                <div className="grid grid-cols-3 justify-between items-center">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      {item.when?.startTime
                        ? format(
                            fromUnixTime(item.when.startTime),
                            "EEE, dd MMM"
                          )
                        : "No date"}
                    </p>
                    <p className="text-muted-foreground text-xs pt-1">
                      {item.when?.startTime && item.when?.endTime ? (
                        <>
                          {format(fromUnixTime(item.when.startTime), "hh:mm a")}{" "}
                          - {format(fromUnixTime(item.when.endTime), "hh:mm a")}
                        </>
                      ) : (
                        "No time"
                      )}
                    </p>
                    <div className="flex items-center mt-1">
                      {
                        item.conferencing?.details?.url ? (
                          <>
                            <Video className="size-4 mr-2 text-primary" />
                            <a
                              className="text-xs text-primary underline underline-offset-4"
                              target="_blank"
                              href={item.conferencing.details.url}
                            >
                              Join Meeting
                            </a>
                          </>
                        ) : null
                        // (
                        //   <span className="text-xs text-muted-foreground">
                        //     No video call link available
                        //   </span>
                        // )
                      }
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <h2 className="text-sm font-medium">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {item.participants.map((participant, index) => (
                        <span key={index}>{`You and ${participant.name}`}</span>
                      ))}
                      {/* {item.participants.map((participant, index) => (
                        <span key={participant.email}>
                          {participant.email === session?.user?.email
                            ? "You"
                            : participant.name}
                          {index < item.participants.length - 1
                            ? index === item.participants.length - 2
                              ? " and "
                              : ", "
                            : ""}
                        </span>
                      ))} */}
                    </p>
                  </div>
                  <SubmitButton
                    text="Cancel Event"
                    variant="destructive"
                    className="w-fit flex ml-auto"
                  />
                </div>
                <Separator className="my-3" />
              </form>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default MeetingsPage;

{
  /* <form key={item.id} action={cancelMeetingAction}>
                <input type="hidden" name="eventId" value={item.id} />
                <div className="grid grid-cols-3 justify-between items-center">
                  <div>
                    <p>
                      {format(fromUnixTime(item.when.startTime), "EEE, dd MMM")}
                    </p>
                    <p>
                      {format(fromUnixTime(item.when.startTime), "hh:mm a")} -{" "}
                      {format(fromUnixTime(item.when.endTime), "hh:mm a")}
                    </p>
                    <div className="flex items-center">
                      <Video className="size-4 mr-2 text-primary" />{" "}
                      <a target="_blank" href={item.conferencing.details.url}>
                        Join Meeting
                      </a>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <h2>{item.title}</h2>
                    <p>You and {item.participants[0].name}</p>
                  </div>
                  <SubmitButton
                    text="Cancel Event"
                    variant="destructive"
                    className="w-fit flex ml-auto"
                  />
                </div>
                <Separator className="my-3" />
              </form> */
}
