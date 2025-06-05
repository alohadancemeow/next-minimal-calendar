"use server";

import { requireUser } from "@/lib/hooks";
import { prisma } from "@/lib/prisma";
import { onboardingSchema } from "@/lib/zodSchemas";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";

export async function onboardingAction(prevState: unknown, formData: FormData) {
  const session = await requireUser();

  const submission = await parseWithZod(formData, {
    schema: onboardingSchema({
      async isUsernameUnique() {
        const exisitngSubDirectory = await prisma.user.findUnique({
          where: {
            username: formData.get("username") as string,
          },
        });
        return !exisitngSubDirectory;
      },
    }),

    async: true,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await prisma.user.update({
      where: {
        id: session.user?.id,
      },
      data: {
        username: submission.value.username,
        name: submission.value.fullName,
        Availability: {
          createMany: {
            data: [
              {
                day: "Monday",
                fromTime: "08:00",
                tillTime: "18:00",
              },
              {
                day: "Tuesday",
                fromTime: "08:00",
                tillTime: "18:00",
              },
              {
                day: "Wednesday",
                fromTime: "08:00",
                tillTime: "18:00",
              },
              {
                day: "Thursday",
                fromTime: "08:00",
                tillTime: "18:00",
              },
              {
                day: "Friday",
                fromTime: "08:00",
                tillTime: "18:00",
              },
              {
                day: "Saturday",
                fromTime: "08:00",
                tillTime: "18:00",
              },
              {
                day: "Sunday",
                fromTime: "08:00",
                tillTime: "18:00",
              },
            ],
          },
        },
      },
    });
  } catch (error) {
    console.log(error, "error");
  }

  redirect("/onboarding/grant-id");
}
