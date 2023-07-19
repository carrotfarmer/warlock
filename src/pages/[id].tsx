import type { NextPage } from "next";
import { useRouter } from "next/router";

import { Navbar } from "@/components/Navbar";
import { Title } from "@/components/Title";
import { Button } from "@/components/ui/Button";
import { HoverIconButton } from "@/components/HoverIconButton";

import { api } from "@/utils/api";

import { ChevronLeft, Download, Trash2 } from "lucide-react";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { CreateAccount } from "@/components/account/CreateAccount";
import { Account } from "@/components/account/Account";

const SitePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);

  const { data: siteData, isLoading } = api.site.getSite.useQuery({ siteId: id as string });

  return (
    <>
      <Navbar />
      <main>
        {isLoading ? (
          <p>loading...</p>
        ) : (
          <>
            <div className="flex grid grid-cols-3 justify-center">
              <div className="p-5">
                <Button variant="outline" onClick={() => void router.push("/")}>
                  <ChevronLeft className="h-4 w-4" /> home
                </Button>
              </div>
              <div className="flex justify-center">
                <Title>{siteData?.name}</Title>
              </div>
            </div>
            <div className="w-2xl flex justify-center">
              <div className="grid grid-cols-3 gap-5 pt-5">
                <HoverIconButton tooltipText="download data">
                  <Download className="h-4 w-4" />
                </HoverIconButton>

                <HoverIconButton tooltipText="edit site">
                  <Pencil2Icon className="h-4 w-4" />
                </HoverIconButton>

                <HoverIconButton tooltipText="delete site" buttonProps="border-red-400 text-red-300 hover:text-red-900 hover:bg-red-300">
                  <Trash2 className="h-4 w-4" />
                </HoverIconButton>
              </div>
            </div>
            <div className="flex justify-center">
              <CreateAccount siteId={siteData?.id as string} />
            </div>

          </>
        )}

        <div className="flex justify-center px-20">
          <div className="pt-10">
              {siteData?.accounts.map((account) => (
                <Account key={account.id} account={account} />
              ))}
            </div>
        </div>
      </main>
    </>
  );
};

export default SitePage;
