import { Navbar } from "@/components/Navbar";
import { Title } from "@/components/Title";

import type { NextPage } from "next";
import { useRouter } from "next/navigation"

import { useSession } from "next-auth/react";
import { CreateSiteForm } from "@/components/site/CreateSiteForm";

const CreatePage: NextPage = () => {
  const router = useRouter();
  const { data: sessionData, status } = useSession();

  if (status !== "loading" && !sessionData?.user) {
    router.push("/sign-in");
  }

  return (
    <>
      <Navbar />

      <main className="pt-5">
        <div className="flex justify-center">
          <Title>add site</Title>
        </div>

        <div className="flex justify-center pt-5">
          <CreateSiteForm userId={sessionData?.user.id as string} />
        </div>
      </main>
    </>
  );
};

export default CreatePage;
