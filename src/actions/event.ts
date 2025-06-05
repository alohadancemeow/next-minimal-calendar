"use server";

import { requireUser } from "@/lib/hooks";
import { prisma } from "@/lib/prisma";
import { EventTypeServerSchema } from "@/lib/zodSchemas";
import { parseWithZod } from "@conform-to/zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function CreateEventTypeAction(
  prevState: unknown,
  formData: FormData
) {
  const session = await requireUser();

  const submission = await parseWithZod(formData, {
    schema: EventTypeServerSchema({
      async isUrlUnique() {
        const data = await prisma.eventType.findFirst({
          where: {
            userId: session.user?.id,
            url: formData.get("url") as string,
          },
        });
        return !data;
      },
    }),
    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await prisma.eventType.create({
      data: {
        title: submission.value.title,
        duration: submission.value.duration,
        url: submission.value.url,
        description: submission.value.description,
        userId: session.user?.id as string,
        videoCallSoftware: submission.value.videoCallSoftware,
      },
    });
  } catch (error) {
    console.log(error, "error");
  }
  redirect("/dashboard");
}

export async function EditEventTypeAction(
  prevState: unknown,
  formData: FormData
) {
  const session = await requireUser();

  const submission = await parseWithZod(formData, {
    schema: EventTypeServerSchema({
      async isUrlUnique() {
        const data = await prisma.eventType.findFirst({
          where: {
            userId: session.user?.id,
            url: formData.get("url") as string,
          },
        });
        return !data;
      },
    }),

    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await prisma.eventType.update({
      where: {
        id: formData.get("id") as string,
        userId: session.user?.id as string,
      },
      data: {
        title: submission.value.title,
        duration: submission.value.duration,
        url: submission.value.url,
        description: submission.value.description,
        videoCallSoftware: submission.value.videoCallSoftware,
      },
    });
  } catch (error) {
    console.log(error, "error");
  }

  redirect("/dashboard");
}

export async function DeleteEventTypeAction(formData: FormData) {
  const session = await requireUser();

  try {
    await prisma.eventType.delete({
      where: {
        id: formData.get("id") as string,
        userId: session.user?.id as string,
      },
    });
  } catch (error) {
    console.log(error, "error");
  }

  redirect("/dashboard");
}

export async function updateEventTypeStatusAction(
  prevState: unknown,
  {
    eventTypeId,
    isChecked,
  }: {
    eventTypeId: string;
    isChecked: boolean;
  }
) {
  const session = await requireUser();

  try {
    await prisma.eventType.update({
      where: {
        id: eventTypeId,
        userId: session.user?.id as string,
      },
      data: {
        active: isChecked,
      },
    });

    revalidatePath(`/dashboard`);

    return {
      status: "success",
      message: "EventType Status updated successfully",
    };
  } catch (error) {
    console.log(error, "error");

    // return {
    //   status: "error",
    //   message: "Something went wrong",
    // };
  }

  redirect("/dashboard");
}
