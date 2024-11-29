import Link from "next/link";
import React from "react";
// import { cn } from "@/lib/utils";
import MaxWidthWrapper from "../MaxWidthWrapper";
// import { Button } from "@/components/ui/button";
import UserPopover from "@/components/user-popover/UserPopover";
import Logo from "../logo/Logo";
// const buttons = {
//   login: {
//     title: "Login",
//     path: "/login",
//   },
//   register: {
//     title: "Register",
//     path: "/register",
//   },
// };
const Header = () => {
  return (
    <header className="sticky start-0 top-0 z-20 w-full border-none bg-white/80 shadow backdrop-blur transition-all supports-[backdrop-filter]:bg-white/75 ">
      <MaxWidthWrapper>
        <nav className="w-full">
          <div className="mx-auto flex md:max-w-screen-xl items-center justify-between py-2">
            <Link href={"/home"}>
              <Logo />
            </Link>
            {/* <div className="w-1/2"></div> */}
            <div className="w-1/2 md:w-full md:block md:w-auto flex justify-end">
              <ul className="flex flex-row items-center justify-between md:justify-end font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:p-0 rtl:space-x-reverse">
                {/* <Button variant={"destructive"} className="hidden sm:block">
                  <Link
                    href={"/libraries"}
                    className={cn(
                      "sm:py-2 sm:px-3 rounded md:hover:bg-transparent md:border-0  md:p-0  md:dark:hover:bg-transparent"
                    )}
                  >
                    {"Libraries"}
                  </Link>
                </Button> */}
                {/* <Button variant={"secondary"} className="hidden sm:block">
                  <Link
                    href={buttons.login.path}
                    className={cn(
                      "sm:py-2 sm:px-3 rounded md:hover:bg-transparent md:border-0  md:p-0  md:dark:hover:bg-transparent"
                    )}
                  >
                    {buttons.login.title}
                  </Link>
                </Button>
                <Button variant={"default"} className="hidden sm:block">
                  <Link
                    href={buttons.register.path}
                    className={cn(
                      "sm:py-2 sm:px-3 rounded md:hover:bg-transparent md:border-0  md:p-0  md:dark:hover:bg-transparent"
                    )}
                  >
                    {buttons.register.title}
                  </Link>
                </Button> */}
                <UserPopover />
              </ul>
            </div>
          </div>
        </nav>
      </MaxWidthWrapper>
    </header>
  );
};

export default Header;
