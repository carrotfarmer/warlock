import Link from "next/link"

import { Icons } from "@/components/Icons";
import { Navbar } from "@/components/Navbar";
import { Title } from "@/components/Title";
import { buttonVariants } from "@/components/ui/Button";

import { cn } from "@/lib/utils";

const SignUpPage = () => {
  return (
    <>
      <Navbar />
      <div className="flex justify-center pt-20">
        <Title>sign up</Title>
      </div>
      <div className="flex justify-center pt-3">
        <p className="text-gray-300 font-bold text-lg">ready to get started?</p>
      </div>
      <div className="flex justify-center pt-5">
        <button className={cn(buttonVariants({ variant: "outline" }), "w-56 h-12 gap-2 text-sm")}>
          sign up with<Icons.google className="w-5 h-5" />
        </button>
      </div>
      <div className="flex justify-center pt-1">
        <p className="text-sm pt-1 text-gray-500">
          already have an account? <Link href="/auth/sign-in" className="underline underline-offset-4">sign in</Link>
        </p>
      </div>
    </>
  )
}

export default SignUpPage;
