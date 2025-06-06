import { SubmitButton } from "@/components/SubmitButton";
import { prisma } from "@/lib/prisma";
import { times } from "@/lib/times";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/hooks";
import { updateAvailabilityAction } from "@/actions/availability";

async function getData(userId: string) {
  const data = await prisma.availability.findMany({
    where: {
      userId: userId,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

const AvailabilityPage = async () => {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability</CardTitle>
        <CardDescription>
          In this section you can manage your availability.
        </CardDescription>
      </CardHeader>
      <form
        action={async (formData: FormData) => {
          "use server";
          await updateAvailabilityAction(formData);
          return undefined;
        }}
      >
        <CardContent className="flex flex-col gap-y-4">
          {data.map((item) => (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center gap-4"
              key={item.id}
            >
              <input type="hidden" name={`id-${item.id}`} value={item.id} />
              <div className="flex items-center gap-x-3">
                <Switch
                  className="cursor-pointer"
                  name={`isActive-${item.id}`}
                  defaultChecked={item.isActive}
                />
                <p>{item.day}</p>
              </div>
              <Select name={`fromTime-${item.id}`} defaultValue={item.fromTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="From Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {times.map((time) => (
                      <SelectItem key={time.id} value={time.time}>
                        {time.time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select name={`tillTime-${item.id}`} defaultValue={item.tillTime}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="To Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {times.map((time) => (
                      <SelectItem key={time.id} value={time.time}>
                        {time.time}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <SubmitButton
            text="Save Changes"
            className="text-white mt-3 cursor-pointer"
          />
        </CardFooter>
      </form>
    </Card>
  );
};

export default AvailabilityPage;
