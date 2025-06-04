import { SettingsForm } from "@/components/dashboard/SettingsForm";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/hooks";
import { notFound } from "next/navigation";

async function getData(id: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      email: true,
      image: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

const SettingsPage = async () => {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  return (
    <SettingsForm
      email={data.email}
      fullName={data.name as string}
      profileImage={data.image as string}
    />
  );
};

export default SettingsPage;
