import type { SiteAccount } from "@prisma/client";
import React, { useState } from "react";
import { HoverIconButton } from "../HoverIconButton";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { EyeIcon } from "lucide-react";
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setEmail(account.email);

    const decryptedPassword = await decrypt(account.encryptedPassword, data.encryptionKey);

    setPassword(decryptedPassword);
    reset();
  };

  return (
    <div className="grid grid-cols-4 gap-5 rounded-lg px-20 py-4 hover:bg-gray-900">
      <p className="text-md font-bold text-purple-300">{email}</p>
      <p className="pl-10">{password}</p>
      {account.createdAt !== account.updatedAt ? (
        <p className="text-gray-500">
          created on{" "}
          {new Date(account.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      ) : (
        <p className="text-gray-500">
          modified on{" "}
          {new Date(account.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      )}

      <div className="grid grid-cols-3 gap-1">
        <Dialog>
          <DialogTrigger>
            <HoverIconButton tooltipText="view credentials">
              <EyeIcon className="h-4 w-4" />
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
                  <Input {...register("encryptionKey")} />
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

        <HoverIconButton tooltipText="edit credentials">
          <Pencil2Icon className="h-4 w-4" />
        </HoverIconButton>
      </div>
    </div>
  );
};
