"use server";

import { requireUser } from "@/lib/hooks";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateAvailabilityAction(formData: FormData) {
  const session = await requireUser();
  if (!session) return { status: "error", message: "Unauthorized" };

  //   describe this function:
  //   1. get the form data
  //   2. filter the form data to get the availability data
  //   3. update the availability data in the database
  //   4. return the status and message
  //   5. revalidate the path
  //   6. return the status and message
  const rawData = Object.fromEntries(formData.entries());
  const availabilityData = Object.keys(rawData)
    .filter((key) => key.startsWith("id-"))
    .map((key) => {
      const id = key.replace("id-", "");
      return {
        id,
        // - When a checkbox is checked, it sends the value "on" in the form data
        // - When a checkbox is unchecked, it doesn't send any value at all (the key won't exist in the form data)
        // - alternatively, use isActive: rawData[`isActive-${id}`] !== undefined
        isActive: rawData[`isActive-${id}`] === "on",
        fromTime: rawData[`fromTime-${id}`] as string,
        tillTime: rawData[`tillTime-${id}`] as string,
      };
    });

  try {
    await prisma.$transaction(
      availabilityData.map((item) =>
        prisma.availability.update({
          where: { id: item.id },
          data: {
            isActive: item.isActive,
            fromTime: item.fromTime,
            tillTime: item.tillTime,
          },
        })
      )
    );

    revalidatePath("/dashboard/availability");
    return { status: "success", message: "Availability updated successfully" };
  } catch (error) {
    console.error("Error updating availability:", error);
    return { status: "error", message: "Failed to update availability" };
  }
}
