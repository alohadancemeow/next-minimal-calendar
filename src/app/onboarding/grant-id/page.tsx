import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import AlmostFinished from "@/public/work-is-almost-over-happy.gif";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CalendarCheck2 } from "lucide-react";
import Link from "next/link";

const GrantIdRoute = () => {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>You Are Almost Done!</CardTitle>
          <CardDescription>
            We have to now connect your calendar to your account.
          </CardDescription>
          <Image
            src={"/globe.svg"}
            width={50}
            height={50}
            alt="Almost Finished"
            className="w-full rounded-lg"
          />
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full text-white">
            <Link href="/api/auth">
              <CalendarCheck2 className="size-5 mr-2" />
              Connect Calender to Account
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GrantIdRoute;
