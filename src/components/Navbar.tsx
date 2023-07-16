import React from "react";
import { Button } from "./ui/Button";

export const Navbar = ({}) => {
  return (
    <div className="flex justify-between w-full p-4">
      <div className="flex items-center">
        <h1 className="text-2xl font-extrabold">warlock.</h1>
      </div>
      <div className="flex items-center">
        <Button
          className="text-sm font-semibold text-white bg-purple-500 border-none rounded-md hover:bg-purple-600"
          onClick={() => {}}
        >
          sign in
        </Button>
      </div>
    </div>
  );
};

