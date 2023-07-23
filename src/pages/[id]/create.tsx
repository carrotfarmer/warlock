import { Navbar } from "@/components/Navbar";
import { PageHead } from "@/components/PageHead";
import { Title } from "@/components/Title";
import { CreateAccountForm } from "@/components/account/CreateAccountForm";
import { Button } from "@/components/ui/Button";
import { api } from "@/utils/api";
import { ChevronLeft } from "lucide-react";
import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRouter as useRouterRouter } from "next/router";

const CreateSiteAccount: NextPage = () => {
  const router = useRouter();

  const routerRouter = useRouterRouter();
  const { id } = routerRouter.query;

  const { data: siteData, error } = api.site.getSite.useQuery({ siteId: id as string });
  const { data: sessionData, status } = useSession();

  if (status !== "loading" && !sessionData?.user) {
    router.push("/sign-in");
  }

  if (error?.data?.code === "NOT_FOUND") {
    router.push("/404");
  }

  return (
    <>
      <PageHead title={`create account in ${siteData!.name} - warlock`} />
      <Navbar />

      <main className="pt-5">
        <div className="flex grid grid-cols-3 justify-center">
          <div className="p-5">
            <Button variant="outline" onClick={() => void router.push("/")}>
              <ChevronLeft className="h-4 w-4" /> home
            </Button>
          </div>
          <div className="flex justify-center">
            <Title>add account</Title>
          </div>
        </div>

        <div className="flex justify-center pt-5">
          <CreateAccountForm siteId={siteData?.id as string} />
        </div>
      </main>
    </>
  );
};

export default CreateSiteAccount;
