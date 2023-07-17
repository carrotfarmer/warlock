import React from "react";

import { Button } from "./ui/Button";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

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
          <Button
            className="rounded-md border-none bg-purple-500 text-sm font-semibold text-white hover:bg-purple-600"
            onClick={() => void signOut()}
          >
            sign out
          </Button>
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
