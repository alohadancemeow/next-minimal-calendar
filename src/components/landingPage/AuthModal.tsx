import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// import Logo from "@/public/logo.png";
// import Image from "next/image";

import { GitHubAuthButton, GoogleAuthButton } from "../SubmitButton";
import { signIn } from "../../../auth";

export function AuthModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">Try for Free</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader className="flex-row justify-center items-center gap-x-2">
          <DialogTitle>
            {/* <Image src={"/globe.svg"} className="size-10" alt="Logo" /> */}
            <div className="text-3xl font-semibold">
              My<span className="text-primary">Calendar</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-5">
          <form
            className="w-full"
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <GoogleAuthButton />
          </form>

          <form
            className="w-full"
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <GitHubAuthButton />
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
