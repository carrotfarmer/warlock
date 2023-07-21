import React, { useState } from "react";

import Link from "next/link";
import { Inter } from "next/font/google";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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
} from "../ui/Dialog";

import { HoverIconButton } from "../HoverIconButton";

import type { ExtendedSite } from "@/lib/types";

import { Download, Trash2 } from "lucide-react";

import { EncryptionKeyHint } from "./EncryptionKeyHint";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type SiteActionFormData, SiteActionValidator } from "@/lib/validators/site";

import { api } from "@/utils/api";
import { useToast } from "@/lib/hooks/use-toast";

import fileDownload from "js-file-download";

interface SiteCardProps {
  site: ExtendedSite;
}

const inter = Inter({ subsets: ["latin"] });

export const SiteCard: React.FC<SiteCardProps> = ({ site }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);
  const [isVerifySuccess, setIsVerifySuccess] = useState<boolean>(false);

  const { mutate: verify } = api.site.verifyEncryptionKey.useMutation({
    onSuccess: () => {
      setIsVerifySuccess(true);
    },

    onError: (error) => {
      setIsVerifySuccess(false);
      reset();

      toast({
        title: "permission denied",
        description: error.message,
        variant: "destructive"
      })
    }
  })

  const utils = api.useContext();
  const { mutate: deleteSite } = api.site.deleteSite.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  const { mutate: downloadData } = api.site.downloadSiteData.useMutation({
    onSuccess: (data) => {
      fileDownload(data.file, `${site.name}.json`);

      resetDownload();
      toast({
        title: "successfully downloaded data",
        description: "successfully downloaded decrypted data.",
      });

      setIsDownloadOpen(false);
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

  const {
    register: downloadRegister,
    handleSubmit: handleDownloadSubmit,
    formState: { errors: downloadErrors },
    reset: resetDownload,
  } = useForm<SiteActionFormData>({
    resolver: zodResolver(SiteActionValidator),
  });

  const { toast } = useToast();

  const onSubmit = (data: SiteActionFormData): void => {
    verify({ siteId: site.id, encryptionKey: data.encryptionKey });

    if (!isVerifySuccess) {
      return;
    }

    deleteSite({ siteId: site.id });
    reset();
    toast({
      title: "successfully deleted site",
      description: "you have successfully deleted this site.",
    });
  };

  // download
  const onDownloadSubmit = (data: SiteActionFormData): void => {
    downloadData({ siteId: site.id, encryptionKey: data.encryptionKey });
  };

  return (
    <Card className="h-32 max-w-xl">
      <CardHeader className="grid auto-cols-max grid-flow-col gap-x-4">
        <Link href={`/${site.id}`} className="w-40">
          <CardTitle className="max-w-lg pt-2 underline underline-offset-4 hover:text-purple-300">
            {site.name.length > 17 ? `${site.name.slice(0, 17)}...` : site.name}
          </CardTitle>
        </Link>
        <div className="h-6 w-8 rounded-md bg-gray-800">
          <p className="flex justify-center font-semibold">{site.accounts.length}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 justify-items-start">
          <Dialog open={isDownloadOpen} onOpenChange={setIsDownloadOpen}>
            <DialogTrigger>
              <HoverIconButton tooltipText="download data" onClick={() => setIsDownloadOpen(true)}>
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
                      enter this site&apos;s encryption key to download the credentials. if you do
                      not remember the encryption key you can use the hint given below.
                    </p>

                    <Label>encryption key</Label>
                    <Input type="password" {...downloadRegister("encryptionKey")} />
                    <p className="pt-1 text-red-500">{downloadErrors.encryptionKey?.message}</p>
                    <EncryptionKeyHint siteId={site.id} />
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

          <AlertDialog>
            <AlertDialogTrigger>
              <HoverIconButton tooltipText="delete site">
                <Trash2 className="h-4 w-4" />
              </HoverIconButton>
            </AlertDialogTrigger>
            <AlertDialogContent className={inter.className}>
              <AlertDialogHeader>
                <AlertDialogTitle>are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  this action cannot be undone. this will permanently delete this site and remove
                  your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => setIsOpen(true)}>Continue</AlertDialogAction>
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
                      enter this site&apos;s encryption key to view the credentials. if you do not
                      remember the encryption key you can use the hint given below.
                    </p>
                    <Label>encryption key</Label>
                    <Input type="password" {...register("encryptionKey")} />
                    <p className="pt-1 text-red-500">{errors.encryptionKey?.message}</p>
                    <EncryptionKeyHint siteId={site.id} />
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
      </CardContent>
    </Card>
  );
};
