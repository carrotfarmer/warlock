import React from "react";

import { Button } from "./ui/Button";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/Avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const Navbar = ({}) => {
  const { data: session } = useSession();

  return (
    <div className="flex w-full justify-between border-b border-slate-800 p-4 shadow-lg">
      <div className="flex items-center">
        <Link href="/">
          <h1 className="text-2xl font-extrabold text-purple-200">warlock.</h1>
        </Link>
      </div>
      <div className="flex items-center">
        {session ? (
          <div className="grid grid-cols-2">
            <Popover>
              <PopoverTrigger>
                <Avatar>
                  <AvatarImage src={session.user.image as string} alt={session.user.name as string} />
                </Avatar>
              </PopoverTrigger>

              <PopoverContent className={cn(inter.className, "text-sm")}>
                Logged in as: <p className="font-bold text-purple-300">{session.user.email as string}</p>
              </PopoverContent>
            </Popover>

            <Button
              className="rounded-md border-none bg-purple-500 text-sm font-semibold text-white hover:bg-purple-600"
              onClick={() => void signOut()}
            >
              sign out
            </Button>
          </div>
        ) : (
          <Button
            className="rounded-md border-none bg-purple-500 text-sm font-semibold text-white hover:bg-purple-600"
            onClick={() => void signIn()}
          >
            sign in
          </Button>
        )}
      </div>
    </div>
  );
};
