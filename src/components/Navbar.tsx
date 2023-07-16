import React from "react";

import { Button } from "./ui/Button";

import { useSession, signIn, signOut } from "next-auth/react";

export const Navbar = ({}) => {
  const { data: session } = useSession();

  return (
    <div className="flex w-full justify-between p-4 border-b border-slate-800 shadow-lg">
      <div className="flex items-center">
        <h1 className="text-2xl font-extrabold text-purple-200">warlock.</h1>
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
