import React from "react";
import { Icons } from "../Icons";
import { Button } from "../ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const LandingPage: React.FC = ({}) => {
  const router = useRouter();

  return (
    <div className="pt-3">
      <div className="flex justify-center">
        <div className="max-w-4xl">
          <h1 className="text-7xl font-extrabold text-purple-200">
            <p className="bg-gradient-to-r from-purple-200 to-purple-500 bg-clip-text py-3 text-transparent">
              password management.
            </p>
            <p>
              as <span className="text-green-200 underline underline-offset-4">secure</span> as it
              gets.
            </p>
            <p>
              as <span className="text-blue-200 underline underline-offset-4">simple</span> as it
              gets.
            </p>
          </h1>
        </div>
      </div>
      <div className="flex justify-center pt-20">
        <div className="max-w-2xl">
          <p className="text-xl text-gray-400">
            warlock is a password manager that values{" "}
            <span className="font-extrabold text-green-200">security</span> without compromising on
            simplicity. we use <span className="font-extrabold text-blue-300">encryption keys</span>{" "}
            provided by <span className="font-extrabold">you</span> to encrypt your passwords. you
            use these encryption keys to{" "}
            <span className="font-extrabold text-red-300">decrypt</span> and access your passwords
            from anywhere. you also configure <span className="font-extrabold">hints</span> to help
            you remember your encryption keys.
          </p>
          <p className="pt-8 text-xl text-gray-400">and you know what&apos;s the best part?</p>
          <p className="text-2xl font-extrabold text-yellow-400">
            we don&apos;t store your encryption keys.
          </p>
          <p className="pt-8 text-xl text-gray-400">
            that&apos;s right. we don&apos;t store your encryption keys. don&apos;t believe us?
          </p>
          <p className="text-xl font-extrabold text-gray-300">
            check out the{" "}
            <span className="text-purple-400 underline underline-offset-4">
              <Link href="https://github.com/carrotfarmer/warlock">source code</Link>
            </span>
            .
          </p>
          <p className="pt-8 text-xl text-gray-400">still don&apos;t believe us?</p>
          <p className="text-xl font-extrabold text-gray-300">
            you can get your data off our servers anytime by downloading all the credentials for
            your sites onto your local computer.
          </p>
          <p className="pt-8 text-xl text-gray-400">ready to get started?</p>
          <p className="py-2 text-xs text-gray-600">
            don&apos;t worry, google won&apos;t store your password either.
          </p>
          <div className="flex justify-center pb-36">
            <Button
              variant="outline"
              type="button"
              size="lg"
              onClick={() => router.push("/auth/sign-up")}
            >
              sign up with <Icons.google className="ml-2 mr-2 h-4 w-4" /> google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
