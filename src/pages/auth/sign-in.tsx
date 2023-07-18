import Link from "next/link";

import { Icons } from "@/components/Icons";
import { Navbar } from "@/components/Navbar";
import { Title } from "@/components/Title";
import { buttonVariants } from "@/components/ui/Button";

import { cn } from "@/lib/utils";
import { signIn } from "next-auth/react";

const SignInPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex justify-center pt-20">
        <Title>sign in</Title>
      </div>
      <div className="flex justify-center pt-3">
        <p className="text-lg font-bold text-gray-300">welcome back!</p>
      </div>
      <div className="flex justify-center pt-5">
        <button
          className={cn(buttonVariants({ variant: "outline" }), "h-12 w-56 gap-2 text-sm")}
          // eslint-disable-next-line
          onClick={() => signIn("google", {
            callbackUrl: "/"
          })}
        >
          sign in with
          <Icons.google className="h-5 w-5" />
        </button>
      </div>
      <div className="flex justify-center pt-1">
        <p className="pt-1 text-sm text-gray-500">
          don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" className="underline underline-offset-4">
            sign up
          </Link>
        </p>
      </div>
    </>
  );
};

export default SignInPage;
