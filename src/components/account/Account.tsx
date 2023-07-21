import type { SiteAccount } from "@prisma/client";
import React, { useState } from "react";
import { HoverIconButton } from "../HoverIconButton";
import { LockClosedIcon, LockOpen1Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { Copy, EyeIcon, EyeOff, Trash2 } from "lucide-react";
import { decrypt, displayEmail } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog";
import { EncryptionKeyHint } from "../site/EncryptionKeyHint";
import { Input } from "../ui/Input";
import { Inter } from "next/font/google";
import { z } from "zod";
import { Label } from "../ui/Label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/Button";
import { useToast } from "@/lib/hooks/use-toast";
import { api } from "@/utils/api";

interface AccountProps {
  account: SiteAccount;
}

const inter = Inter({
  subsets: ["latin"],
});

const formSchema = z.object({
  encryptionKey: z
    .string()
    .min(3, { message: "encryption key must be at least 3 characters long" })
    .max(75, { message: "encryption key cannot be greater than 75 characters" }),
});

type FormData = z.infer<typeof formSchema>;

export const Account: React.FC<AccountProps> = ({ account }) => {
  const [email, setEmail] = useState<string>(displayEmail(account.email));
  const [password, setPassword] = useState<string>("*************");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // unlock dialog
  const [open, setIsOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const utils = api.useContext();
  const { mutate: deleteAccount } = api.account.deleteAccount.useMutation({
    onSuccess: async () => {
      await utils.invalidate()
    },
  })

  const { toast } = useToast();

  const onSubmit = (data: FormData) => {
    const decryptedPassword = decrypt(account.encryptedPassword, data.encryptionKey);

    if (decryptedPassword.includes("�")) {
      reset();
      setPassword("invalid encryption key");
      toast({
        title: "invalid encryption key",
        description: "the encryption key you entered is invalid. please try again.",
        variant: "destructive",
      });
      return;
    }

    setPassword(decryptedPassword);
    setEmail(account.email);
    setIsVisible(true);
    setIsOpen(false);
    reset();
  };

  return (
    <div className="grid grid-cols-4 gap-4 rounded-lg px-20 py-4 hover:bg-gray-900">
      <p className="text-md pt-1 font-bold text-purple-300">{email}</p>
      <p className="flex justify-center pt-1">{password}</p>
      {account.createdAt !== account.updatedAt ? (
        <p className="pt-1 text-gray-500">
          created on{" "}
          {new Date(account.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      ) : (
        <p className="pt-1 text-gray-500">
          modified on{" "}
          {new Date(account.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      )}

      <div className="grid grid-cols-3 gap-1">
        {!isVisible ? (
          <Dialog open={open} onOpenChange={setIsOpen}>
            <DialogTrigger>
              <HoverIconButton tooltipText="unlock credentials">
                <LockOpen1Icon className="h-4 w-4" />
              </HoverIconButton>
            </DialogTrigger>
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
                    <EncryptionKeyHint siteId={account.siteId} />
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <div className="pt-5">
                    <Button type="submit">decrypt password</Button>
                  </div>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        ) : (
          <HoverIconButton
            tooltipText="lock credentials"
            onClick={() => {
              setIsVisible(false);
              setPassword("*************");
              setEmail(displayEmail(account.email));
            }}
          >
            <LockClosedIcon className="h-4 w-4" />
          </HoverIconButton>
        )}

        {isVisible && (
          <div className="grid grid-cols-3 gap-12">
            <HoverIconButton tooltipText="edit password">
              <Pencil2Icon className="h-4 w-4" />
            </HoverIconButton>

            <HoverIconButton
              tooltipText="copy password"
              // eslint-disable-next-line
              onClick={async () => {
                toast({
                  title: "copied password",
                  description: "successfully copied the password to your clipboard",
                  variant: "default",
                });
                await navigator.clipboard.writeText(password);
                setIsVisible(false);
                setPassword("*************");
                setEmail(displayEmail(account.email))
              }}
            >
              <Copy className="h-4 w-4" />
            </HoverIconButton>
            <HoverIconButton
              tooltipText="delete credentials"
              // eslint-disable-next-line
              onClick={async () => {
                deleteAccount({ accountId: account.id })
                toast({
                  title: "deleted credentials successfully",
                  variant: "default",
                });
                setPassword("*************");
              }}
              className="border-red-300 text-red-300 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </HoverIconButton>
          </div>
        )}
      </div>
    </div>
  );
};
