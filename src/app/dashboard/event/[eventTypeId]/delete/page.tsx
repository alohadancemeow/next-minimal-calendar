import { DeleteEventTypeAction } from "@/actions/event";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const DeleteEventType = async ({
  params,
}: {
  params: { eventTypeId: string };
}) => {
  const { eventTypeId } = await params;

  return (
    <div className="flex-1 flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Delete Event Type</CardTitle>
          <CardDescription>
            Are you sure you want to delete this event type?
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex justify-between gap-2">
          <Button asChild variant="secondary">
            <Link href="/dashboard">Cancel</Link>
          </Button>
          <form action={DeleteEventTypeAction}>
            <input type="hidden" name="id" value={eventTypeId} />
            <Button variant="destructive">Delete</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeleteEventType;
