"use client";

import React, { useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { getRandomColor } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import {
  ChartNoAxesCombinedIcon,
  ClipboardPenIcon,
  HandCoinsIcon,
} from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "../ui/button";
const UserPopover = () => {
  const { data: session } = useSession();
  const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);
  const color = getRandomColor(session?.user?.name as string);
  if (!session) {
    return <Button onClick={() => signIn("google")}>Sign in</Button>;
  }
  return (
    <Popover open={isOpenPopup} onOpenChange={setIsOpenPopup}>
      <PopoverTrigger className="flex items-center gap-2 text-sm">
        <span className="font-semibold text-pretty">
          {session?.user?.name as string}
        </span>
        <Avatar
          className="flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <AvatarImage
            src={session?.user?.image as string}
            alt={session?.user?.name as string}
          />
          <AvatarFallback className="text-white font-bold">
            {session?.user?.name
              ? session?.user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : ""}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <div className="grid gap-4">
          <Button
            variant={"link"}
            className="p-0 w-full h-full"
            onClick={() => setIsOpenPopup(false)}
          >
            <Link href={"/reports"} className="h-full w-full flex gap-4">
              <ChartNoAxesCombinedIcon />
              {"Bao cao thu chi"}
            </Link>
          </Button>
          <Button
            variant={"link"}
            className="p-0 w-full h-full"
            onClick={() => setIsOpenPopup(false)}
          >
            <Link href={"/transactions"} className="h-full w-full flex gap-4">
              <HandCoinsIcon />
              {"Du lieu"}
            </Link>
          </Button>
          <Button
            variant={"link"}
            className="p-0 w-full h-full"
            onClick={() => setIsOpenPopup(false)}
          >
            <Link href={"/categories"} className="h-full w-full flex gap-4">
              <ClipboardPenIcon />
              {"Them muc"}
            </Link>
          </Button>

          <Button
            onClick={() => {
              signOut({ callbackUrl: "http://localhost:3000" });
            }}
          >
            Sign out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserPopover;
