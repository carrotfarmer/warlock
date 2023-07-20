import React, { useState } from "react";

import Link from "next/link";
import { Inter } from "next/font/google";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
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
} from "../ui/Dialog";

import { HoverIconButton } from "../HoverIconButton";

import type { ExtendedSite } from "@/lib/types";

import { Download, Trash2 } from "lucide-react";
import { Label } from "@radix-ui/react-label";

import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

import { EncryptionKeyHint } from "./EncryptionKeyHint";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "@/utils/api";
import { useToast } from "@/lib/hooks/use-toast";
import { SiteActionFormData, SiteActionValidator } from "@/lib/validators/site";

interface SiteCardProps {
  site: ExtendedSite;
}

const inter = Inter({ subsets: ["latin"] });

export const SiteCard: React.FC<SiteCardProps> = ({ site }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const utils = api.useContext();
  const { mutate: deleteSite } = api.site.deleteSite.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    }
  })

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
    deleteSite({ siteId: site.id })
    reset();
    toast({
      title: "successfully deleted site",
      description: "you have successfully deleted this site."
    })
  }

  return (
    <Card className="h-32 max-w-xl">
      <CardHeader className="grid grid-flow-col auto-cols-max gap-x-4">
        <Link href={`/${site.id}`} className="w-40">
          <CardTitle className="pt-2 underline underline-offset-4 hover:text-purple-300 max-w-lg">
            {site.name.length > 17 ? `${site.name.slice(0, 17)}...` : site.name} 
          </CardTitle>
        </Link>
        <div className="h-6 w-8 rounded-md bg-gray-800">
          <p className="flex justify-center font-semibold">{site.accounts.length}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 justify-items-start">
          <HoverIconButton tooltipText="download data">
            <Download className="h-4 w-4" />
          </HoverIconButton>

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
