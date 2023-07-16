import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex justify-center pt-5">
      <Button>test</Button>
    </div>
  );
}
