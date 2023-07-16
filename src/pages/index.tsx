import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/Button";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div >
      <div className="flex justify-center">
        <Navbar />
      </div>
    </div>
  );
}
