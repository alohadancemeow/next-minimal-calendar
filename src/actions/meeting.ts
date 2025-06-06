"use server";

import { requireUser } from "@/lib/hooks";
import { nylas } from "@/lib/nylas";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createMeetingAction(formData: FormData) {
  const getUserData = await prisma.user.findUnique({
    where: {
      username: formData.get("username") as string,
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  });

  if (!getUserData) {
    throw new Error("User not found");
  }

  const eventTypeData = await prisma.eventType.findUnique({
    where: {
      id: formData.get("eventTypeId") as string,
    },
    select: {
      title: true,
      description: true,
    },
  });

  const formTime = formData.get("fromTime") as string;
  const meetingLength = Number(formData.get("meetingLength"));
  const eventDate = formData.get("eventDate") as string;
  const startDateTime = new Date(`${eventDate}T${formTime}:00`);

  // Calculate the end time by adding the meeting length (in minutes) to the start time
  const endDateTime = new Date(startDateTime.getTime() + meetingLength * 60000);

  try {
    await nylas.events.create({
      identifier: getUserData?.grantId as string,
      requestBody: {
        title: eventTypeData?.title,
        description: eventTypeData?.description,
        when: {
          startTime: Math.floor(startDateTime.getTime() / 1000),
          endTime: Math.floor(endDateTime.getTime() / 1000),
        },
        conferencing: {
          autocreate: {},
          provider: "Google Meet",
        },
        participants: [
          {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            status: "yes",
          },
        ],
      },
      queryParams: {
        calendarId: getUserData?.grantEmail as string,
        notifyParticipants: true,
      },
    });
  } catch (error) {
    console.log(error);
  }

  redirect(`/success`);
}

export async function cancelMeetingAction(formData: FormData) {
  const session = await requireUser();

  const userData = await prisma.user.findUnique({
    where: {
      id: session.user?.id as string,
    },
    select: {
      grantEmail: true,
      grantId: true,
    },
  });

  if (!userData) {
    throw new Error("User not found");
  }

  try {
    await nylas.events.destroy({
      eventId: formData.get("eventId") as string,
      identifier: userData?.grantId as string,
      queryParams: {
        calendarId: userData?.grantEmail as string,
      },
    });
  } catch (error) {
    console.log(error);
  }

  revalidatePath("/dashboard/meetings");
}
