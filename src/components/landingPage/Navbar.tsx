// import Image from "next/image";
import Link from "next/link";
// import Logo from "@/public/logo.png";

import { AuthModal } from "./AuthModal";
import { CalendarDays } from "lucide-react";
import { ThemeToggle } from "../dashboard/ThemeToggle";

export function Navbar() {
  return (
    <div className="relative flex flex-col w-full py-5 mx-auto md:flex-row md:items-center md:justify-between">
      <div className="flex flex-row items-center justify-between text-sm lg:justify-start">
        <Link href="/" className="flex items-center gap-2">
          {/* <Image src={"/globe.svg"} className="size-10" alt="Logo" /> */}
          <CalendarDays className="size-10" />
          <h4 className="text-3xl font-semibold">
            My<span className="text-primary">Calendar</span>
          </h4>
        </Link>
        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </div>

      <nav className="hidden md:flex md:justify-end md:space-x-4">
        <ThemeToggle />
        <AuthModal />
      </nav>
    </div>
  );
}
