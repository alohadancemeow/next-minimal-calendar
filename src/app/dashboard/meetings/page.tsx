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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

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
              <div key={item.id}>
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
                      {item.conferencing?.details?.url ? (
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
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col items-start">
                    <h2 className="text-sm font-medium">{item.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {item.participants.map((participant, index) => (
                        <span key={index}>{`You and ${participant.name}`}</span>
                      ))}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="w-fit flex ml-auto cursor-pointer"
                        variant="destructive"
                      >
                        Cancel Event
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your event and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                          Cancel
                        </AlertDialogCancel>
                        <form action={cancelMeetingAction}>
                          <input type="hidden" name="eventId" value={item.id} />
                          <AlertDialogAction asChild>
                            <SubmitButton
                              text="Continue"
                              variant="destructive"
                              className="text-white"
                            />
                          </AlertDialogAction>
                        </form>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Separator className="my-3" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default MeetingsPage;
