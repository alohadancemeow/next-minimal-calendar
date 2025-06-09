import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarArrowUp, CalendarCheck2 } from "lucide-react";
import Link from "next/link";

const GrantIdRoute = () => {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center justify-center text-center">
          <CardTitle>You Are Almost Done!</CardTitle>
          <CardDescription>
            We have to now connect your calendar to your account.
          </CardDescription>
          <CalendarArrowUp className="size-50 m-auto" />
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
