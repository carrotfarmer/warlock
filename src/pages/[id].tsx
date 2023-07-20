import type { NextPage } from "next";
import { useRouter } from "next/router";

import { Navbar } from "@/components/Navbar";
import { Title } from "@/components/Title";
import { Button } from "@/components/ui/Button";
import { HoverIconButton } from "@/components/HoverIconButton";

import { api } from "@/utils/api";

import { ChevronLeft, Download, PlusSquare, Trash2 } from "lucide-react";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { CreateAccount } from "@/components/account/CreateAccount";
import { Account } from "@/components/account/Account";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/AlertDialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/lib/hooks/use-toast";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { EncryptionKeyHint } from "@/components/site/EncryptionKeyHint";
import { Inter } from "next/font/google";
import { z } from "zod";
import { useState } from "react";
import { SiteActionFormData, SiteActionValidator } from "@/lib/validators/site";

const inter = Inter({ subsets: ["latin"] });

const SitePage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const utils = api.useContext();
  const { mutate: deleteSite } = api.site.deleteSite.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SiteActionFormData>({
    resolver: zodResolver(SiteActionValidator),
  });

  const { toast } = useToast();

  const onSubmit = (): void => {
    deleteSite({ siteId: id as string });
    reset();
    toast({
      title: "successfully deleted site",
      description: "you have successfully deleted this site.",
    });
    setIsOpen(false);
  };

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

                <AlertDialog>
                  <AlertDialogTrigger>
                    <HoverIconButton
                      tooltipText="delete site"
                      buttonProps="border-red-400 text-red-300 hover:text-red-900 hover:bg-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </HoverIconButton>
                  </AlertDialogTrigger>
                  <AlertDialogContent className={inter.className}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        this action cannot be undone. this will permanently delete this site and
                        remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => setIsOpen(true)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogContent className={inter.className}>
                    {/* eslint-disable-next-line */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <DialogHeader>
                        <DialogTitle>enter encryption key</DialogTitle>
                        <DialogDescription>
                          <p className="pb-5">
                            enter this site&apos;s encryption key to view the credentials. if you do
                            not remember the encryption key you can use the hint given below.
                          </p>
                          <Label>encryption key</Label>
                          <Input type="password" {...register("encryptionKey")} />
                          <p className="pt-1 text-red-500">{errors.encryptionKey?.message}</p>
                          <EncryptionKeyHint siteId={id as string} />
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <div className="pt-5">
                          <Button type="submit">delete credentials</Button>
                        </div>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="flex justify-center">
              <CreateAccount siteId={siteData?.id as string} />
            </div>
          </>
        )}

        <div className="flex justify-center px-20">
          <div className="max-w-4xl pt-10">
            {siteData?.accounts.length === 0 && (
              <div>
                <PlusSquare className="mx-auto h-48 w-48 text-gray-700" />
                <p className="pt-5 text-center text-xl text-muted-foreground">
                  create an account to get started!
                </p>
              </div>
            )}
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
