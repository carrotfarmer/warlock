import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useRouter as useRouterRouter } from "next/navigation";
import { Inter } from "next/font/google";

import { useState } from "react";

import { Navbar } from "@/components/Navbar";
import { Title } from "@/components/Title";
import { Button } from "@/components/ui/Button";
import { HoverIconButton } from "@/components/HoverIconButton";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

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
  DialogTrigger,
} from "@/components/ui/Dialog";

import { api } from "@/utils/api";

import { ChevronLeft, Download, PlusSquare, Trash2 } from "lucide-react";
import { Pencil2Icon } from "@radix-ui/react-icons";

import { CreateAccount } from "@/components/account/CreateAccount";
import { Account } from "@/components/account/Account";
import { EncryptionKeyHint } from "@/components/site/EncryptionKeyHint";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/lib/hooks/use-toast";
import { type SiteActionFormData, SiteActionValidator } from "@/lib/validators/site";

import fileDownload from "js-file-download";
import { EditSiteDialog } from "@/components/site/EditSiteDialog";

const inter = Inter({ subsets: ["latin"] });

const SitePage: NextPage = () => {
  const router = useRouter();
  const routerRouter = useRouterRouter();
  const { id } = router.query;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);
  // encryption key for edit
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  // actual edit dialog
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);

  const [isVerifySuccess, setIsVerifySuccess] = useState<boolean | null>(null);

  const { mutate: verify } = api.site.verifyEncryptionKey.useMutation({
    onSuccess: () => {
      setIsVerifySuccess(true);
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "permission denied",
        description: error.message,
        variant: "destructive"
      })

      setIsEditDialogOpen(false);
      setIsVerifySuccess(false);
      reset();
      resetDownload();
    }
  })

  const utils = api.useContext();
  const { mutate: deleteSite } = api.site.deleteSite.useMutation({
    onSuccess: async () => {
      toast({
        title: "successfully deleted site",
        description: "successfully deleted site and credentials.",
      })
      await utils.invalidate();
      await router.push("/")
    },
  });

  const { mutate: downloadData } = api.site.downloadSiteData.useMutation({
    onSuccess: (data) => {
      fileDownload(data.file, `${siteData?.name as string}.json`);
      resetDownload();

      toast({
        title: "successfully downloaded data",
        description: "successfully downloaded decrypted data.",
      });

      setIsDownloadOpen(false);
    },
    onError: (error) => {
      toast({
        title: "could not download data",
        description: error.message,
        variant: "destructive"
      })
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SiteActionFormData>({
    resolver: zodResolver(SiteActionValidator),
  });

  const {
    register: registerDownload,
    handleSubmit: handleDownloadSubmit,
    formState: { errors: downloadErrors },
    reset: resetDownload,
  } = useForm<SiteActionFormData>({
    resolver: zodResolver(SiteActionValidator),
  });

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    formState: { errors: editErrors },
    reset: resetEdit,
  } = useForm<SiteActionFormData>({
    resolver: zodResolver(SiteActionValidator),
  });

  const { toast } = useToast();

  // deletion
  const onSubmit = (data: SiteActionFormData): void => {
    if (siteData!.accounts.length < 1) {
      setIsOpen(true);
      deleteSite({ siteId: siteData!.id });
      return;
    }

    // verify encryption key
    verify({ siteId: id as string, encryptionKey: data.encryptionKey });

    if (isVerifySuccess === false) {
      setIsVerifySuccess(false);
      reset();
      return;
    }

    deleteSite({ siteId: id as string });
    setIsVerifySuccess(null);
    reset();
  };

  // download
  const onDownloadSubmit = (data: SiteActionFormData): void => {
    downloadData({ siteId: id as string, encryptionKey: data.encryptionKey });
  };

  // edit 
  const onEditSubmit = (data: SiteActionFormData): void => {
    verify({ siteId: id as string, encryptionKey: data.encryptionKey });
    console.log(isVerifySuccess)

    if (typeof isVerifySuccess === "boolean" && isVerifySuccess === false) {
      setIsVerifySuccess(false);
      setIsEditDialogOpen(false);
      resetEdit();
      return;
    }

    setIsVerifySuccess(null);
    setIsEditOpen(false);
    setIsEditDialogOpen(true);
    resetEdit();
  };

  const {
    data: siteData,
    isLoading,
    error,
  } = api.site.getSite.useQuery({
    siteId: id as string,
  });

  if (error?.data?.code === "NOT_FOUND") {
    routerRouter.push("/404");
  }

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
                <Dialog open={isDownloadOpen} onOpenChange={setIsDownloadOpen}>
                  <DialogTrigger>
                    <HoverIconButton
                      tooltipText="download data"
                      onClick={() => setIsDownloadOpen(true)}
                    >
                      <Download className="h-4 w-4" />
                    </HoverIconButton>
                  </DialogTrigger>
                  <DialogContent className={inter.className}>
                    {/* eslint-disable-next-line */}
                    <form onSubmit={handleDownloadSubmit(onDownloadSubmit)}>
                      <DialogHeader>
                        <DialogTitle>enter encryption key</DialogTitle>
                        <DialogDescription>
                          <p className="pb-5">
                            enter this site&apos;s encryption key to view the credentials. if you do
                            not remember the encryption key you can use the hint given below.
                          </p>

                          <Label>encryption key</Label>
                          <Input type="password" {...registerDownload("encryptionKey")} />
                          <p className="pt-1 text-red-500">
                            {downloadErrors.encryptionKey?.message}
                          </p>
                          <EncryptionKeyHint siteId={id as string} />
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <div className="pt-5">
                          <Button type="submit">download data</Button>
                        </div>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger>
                <HoverIconButton tooltipText="edit site">
                  <Pencil2Icon className="h-4 w-4" />
                </HoverIconButton>
                  </DialogTrigger>
                  <DialogContent className={inter.className}>
                    {/* eslint-disable-next-line */}
                    <form onSubmit={handleEditSubmit(onEditSubmit)}>
                      <DialogHeader>
                        <DialogTitle>enter encryption key</DialogTitle>
                        <DialogDescription>
                          <p className="pb-5">
                            enter this site&apos;s encryption key to edit the site details. if you do
                            not remember the encryption key you can use the hint given below.
                          </p>

                          <Label>encryption key</Label>
                          <Input type="password" {...registerEdit("encryptionKey")} />
                          <p className="pt-1 text-red-500">
                            {editErrors.encryptionKey?.message}
                          </p>
                          <EncryptionKeyHint siteId={id as string} />
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <div className="pt-5">
                          <Button type="submit">edit site details</Button>
                        </div>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <EditSiteDialog isOpen={isEditDialogOpen} setIsOpen={setIsEditDialogOpen} site={siteData!} />

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
                      <AlertDialogAction onClick={async () => {
                          if (siteData!.accounts.length < 1) {
                            deleteSite({ siteId: siteData!.id }) 
                            await router.push("/")
                            return;
                          }

                          setIsOpen(true)
                        }}>
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
                            enter this site&apos;s encryption key to delete the credentials. if you do
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
