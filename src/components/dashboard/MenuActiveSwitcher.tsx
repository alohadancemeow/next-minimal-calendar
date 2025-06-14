"use client";

import { useActionState, useEffect, useTransition } from "react";
import { updateEventTypeStatusAction } from "@/actions/event";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export function MenuActiveSwitcher({
  initialChecked,
  eventTypeId,
}: {
  eventTypeId: string;
  initialChecked: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [state, action] = useActionState(
    updateEventTypeStatusAction,
    undefined
  );

  useEffect(() => {
    if (state?.status === "success") {
      toast.success(state.message);
    } else if (state?.status === "error") {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Switch
      className="cursor-pointer"
      defaultChecked={initialChecked}
      disabled={isPending}
      onCheckedChange={(isChecked) => {
        startTransition(() => {
          console.log(isChecked);

          action({
            isChecked: isChecked,
            eventTypeId,
          });
        });
      }}
    />
  );
}
