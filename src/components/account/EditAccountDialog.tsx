import React, { type Dispatch, type SetStateAction } from "react";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Inter } from "next/font/google";
import { cn, encrypt } from "@/lib/utils";
import type { ExtendedSite } from "@/lib/types";
import { useForm } from "react-hook-form";
import { type SiteRequest, SiteValidator } from "@/lib/validators/site";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api";
import { SiteAccount } from "@prisma/client";
import { z } from "zod";
import { useToast } from "@/lib/hooks/use-toast";
import { EncryptionKeyHint } from "../site/EncryptionKeyHint";

interface EditAccountDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  account: SiteAccount;
  decryptedPassword: string;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  setPassword: Dispatch<SetStateAction<string>>;
}

const inter = Inter({
  subsets: ["latin"],
});

const formSchema = z.object({
  password: z.string().min(8, { message: "password must be at least 8 characters long" }),
  encryptionKey: z
    .string()
    .min(3, { message: "encryption key must be at least 3 characters long" }),
});

type FormData = z.infer<typeof formSchema>;

export const EditAccountDialog: React.FC<EditAccountDialogProps> = ({
  isOpen,
  setIsOpen,
  account,
  decryptedPassword,
  setIsVisible,
  setPassword,
}) => {
  const utils = api.useContext();
  const { mutate: editAccount } = api.account.editPassword.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      setIsVisible(false);
      setPassword("*************");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const { toast } = useToast();

  const onSubmit = (data: FormData) => {
    const encryptedPassword = encrypt(data.password, data.encryptionKey);

    editAccount({ accountId: account.id, encryptedPassword: encryptedPassword });
    toast({
      title: "password updated",
      description: "your password has been updated successfully.",
    });
    setIsOpen(false);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={cn("sm:max-w-[425px]", inter.className)}>
        <DialogHeader>
          <DialogTitle>edit account details</DialogTitle>
          <DialogDescription>make changes to account site here.</DialogDescription>
        </DialogHeader>
        {/* eslint-disable-next-line */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div>
              <Label htmlFor="name" className="text-right">
                password
              </Label>
              <Input
                defaultValue={decryptedPassword}
                className="col-span-3"
                {...register("password")}
              />
              {errors.password && (
                <p className="pt-2 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="pt-2">
              <Label className="text-right">
                encryption key
              </Label>
              <Input
                className="col-span-3"
                {...register("encryptionKey")}
              />
              {errors.encryptionKey && (
                <p className="pt-2 text-xs text-red-500">{errors.encryptionKey.message}</p>
              )}
            </div>
            <EncryptionKeyHint siteId={account.siteId} />
          </div>
          <DialogFooter className="pt-2">
            <Button type="submit">save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
