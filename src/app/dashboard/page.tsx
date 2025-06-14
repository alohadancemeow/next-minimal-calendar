import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/hooks";
import { ExternalLink, Pen, Settings, Trash, Users2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EmptyState } from "@/components/dashboard/EmptyState";
import { CopyLinkMenuItem } from "@/components/dashboard/CopyLinkMenuItem";
import { MenuActiveSwitcher } from "@/components/dashboard/MenuActiveSwitcher";
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
import { SubmitButton } from "@/components/SubmitButton";
import { DeleteEventTypeAction } from "@/actions/event";

async function getData(id: string) {
  const data = await prisma.user.findUnique({
    where: {
      id: id,
    },

    select: {
      EventType: {
        select: {
          id: true,
          active: true,
          title: true,
          url: true,
          duration: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      username: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

const DashbaordPage = async () => {
  const session = await requireUser();
  const data = await getData(session.user?.id as string);
  // console.log(data, "data");

  return (
    <>
      <div className="flex items-center justify-between px-2">
        <div className="sm:grid gap-1 hidden">
          <h1 className="font-heading text-3xl md:text-4xl">Event Types</h1>
          <p className="text-lg text-muted-foreground">
            Create and manage your event types.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new" className="text-white">
            Create New Event
          </Link>
        </Button>
      </div>
      {data.EventType.length === 0 ? (
        <EmptyState
          title="You have no Event Types"
          description="You can create your first event type by clicking the button below."
          buttonText="Add Event Type"
          href="/dashboard/new"
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.EventType.map((item) => (
            <div
              className="overflow-hidden shadow rounded-lg border relative"
              key={item.id}
            >
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="cursor-pointer"
                    >
                      <Settings className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-20" align="end">
                    <DropdownMenuLabel>Event</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href={`/${data.username}/${item.url}`}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          <span>Preview</span>
                        </Link>
                      </DropdownMenuItem>
                      <CopyLinkMenuItem
                        meetingUrl={`${process.env.NEXT_PUBLIC_URL}/${data.username}/${item.url}`}
                      />
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/event/${item.id}`}>
                          <Pen className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <div className="flex items-center gap-2">
                            <Trash className="mr-2 h-4 w-4 text-red-500" />
                            <span className="text-red-500">Delete</span>
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your event and remove your data
                              from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">
                              Cancel
                            </AlertDialogCancel>
                            <form action={DeleteEventTypeAction}>
                              <input
                                type="hidden"
                                name="eventId"
                                value={item.id}
                              />
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
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <Link href={`/${data.username}/${item.url}`}>
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users2 className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dd>
                          <div className="text-lg font-medium">
                            {item.title}
                          </div>
                        </dd>
                        <dt className="text-xs font-medium text-gray-500 truncate">
                          {item.duration} Minutes Meeting
                        </dt>
                      </dl>
                    </div>
                  </div>
                </div>
              </Link>
              <div className="bg-muted dark:bg-gray-900 px-5 py-3 flex justify-between items-center">
                <MenuActiveSwitcher
                  initialChecked={item.active}
                  eventTypeId={item.id}
                />
                <Link href={`/dashboard/event/${item.id}`}>
                  <Button className="text-white cursor-pointer">
                    Edit Event
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default DashbaordPage;
