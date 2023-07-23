import React, { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type AccountFormData, AccountValidator } from "@/lib/validators/account";

import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

import { EncryptionKeyHint } from "../site/EncryptionKeyHint";

import { api } from "@/utils/api";
import { encrypt, genPassword } from "@/lib/utils";

import { EyeIcon, EyeOff } from "lucide-react";
import { Inter } from "next/font/google";
import { Slider } from "../ui/Slider";
import { Separator } from "../ui/Separator";
import { z } from "zod";

const inter = Inter({ subsets: ["latin"] });

interface CreateAccountFormProps {
  siteId: string;
}

const genPwdSchema = z.object({
  passwordLen: z.number().min(10).max(50),
});

type GenPasswordFormData = z.infer<typeof genPwdSchema>;

export const CreateAccountForm: React.FC<CreateAccountFormProps> = ({ siteId }) => {
  const router = useRouter();

  const [inputType, setInputType] = useState<"text" | "password">("password");

  // for encryption key
  const [ekInputType, setEkInputType] = useState<"text" | "password">("password");

  // password generator modal
  const [isPwdOpen, setIsPwdOpen] = useState<boolean>(false);

  const [passwordLen, setPasswordLen] = useState<number>(12);

  const [generatedPassword, setGeneratedPassword] = useState<string>(genPassword(passwordLen));

  const { mutate: createAccount, isLoading } = api.account.createAccount.useMutation({
    onSuccess: () => {
      router.push(`/${siteId}`);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AccountFormData>({
    resolver: zodResolver(AccountValidator),
  });

  const {
    register: registerPwdGen,
    handleSubmit: pwdGenHandleSubmit,
    formState: { errors: errorsPwdGen },
    reset: resetPwdGen,
    getValues
  } = useForm<GenPasswordFormData>({
    resolver: zodResolver(genPwdSchema),
    defaultValues: {
      passwordLen: 12
    }
  });

  const onSubmit = (data: AccountFormData) => {
    const encryptedPassword = encrypt(data.password, data.encryptionKey);

    createAccount({ siteId, encryptedPassword, email: data.email });
    reset();
  };

  const onPwdGenSubmit = () => {
    // alert("hey")
    setValue("password", generatedPassword);
    resetPwdGen();
    setIsPwdOpen(false);
  };

  return (
    <div>
      <Card className="max-w-lg">
        <CardContent className="pt-5">
          {/* eslint-disable-next-line */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="pt-3">
              <Label>email</Label>
              <Input {...register("email")} placeholder="bob@google.com" />
              {errors.email && <p className="pt-2 text-xs text-red-500">{errors.email.message}</p>}
              <p className="pt-2 text-xs text-gray-500">
                this email is just for your reference, it will not be used for anything else.
              </p>
            </div>

            <div className="pt-3">
              <div className="grid auto-cols-max grid-flow-col gap-x-4">
                <div>
                  <Label>password</Label>
                  <Input {...register("password")} type={inputType} className="w-[200%]" />
                </div>
                <div className="flex justify-center pl-[600%]">
                  <Button size="icon" variant="link" className="flex justify-center pt-10">
                    {inputType === "password" ? (
                      <EyeIcon className="h-4 w-4" onClick={() => setInputType("text")} />
                    ) : (
                      <EyeOff className="h-4 w-4" onClick={() => setInputType("password")} />
                    )}
                  </Button>
                </div>
              </div>
              {errors.password && (
                <p className="pt-2 text-xs text-red-500">{errors.password.message}</p>
              )}
              <p className="pt-2 text-xs text-gray-500">
                this password will be encrypted using this site&apos;s encryption key.
              </p>

              <p className="pt-2 text-xs text-gray-500">
                don&apos;t have a password?
                <Button variant="link" size="sm" onClick={() => setIsPwdOpen(true)}>
                  generate one
                </Button>
              </p>

              <Dialog open={isPwdOpen} onOpenChange={setIsPwdOpen}>
                <DialogContent className={inter.className}>
                  {/* eslint-disable-next-line */}
                  <form onSubmit={pwdGenHandleSubmit(onPwdGenSubmit)}>
                    <DialogHeader>
                      <DialogTitle>password generator</DialogTitle>
                      <DialogDescription>
                        this will help you generate a secure password which can be stored in this
                        site.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="pt-3">
                      <Label>password length</Label>
                      {/* render number input and slider for password length */}
                      <div className="flex flex-row gap-x-4 pt-2">
                        <Input
                          type="number"
                          className="w-20"
                          value={Number(passwordLen)}
                          {...registerPwdGen("passwordLen", { valueAsNumber: true })}
                        />
                        <Slider
                          className="w-xl"
                          defaultValue={[12]}
                          min={10}
                          max={50}
                          step={1}
                          onValueChange={(e) => {
                            // eslint-disable-next-line
                            // @ts-ignore
                            setPasswordLen(Number(e[0]));
                            setGeneratedPassword(genPassword(passwordLen));
                          }}
                        />
                      </div>
                        {errorsPwdGen.passwordLen && (
                        <div className="pt-1 text-xs text-red-500">
                          {errorsPwdGen.passwordLen.message}
                        </div>
                        )}
                      <div className="pt-2">
                        <Label>generated password</Label>
                      </div>
                      <div className="pt-1">
                        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                          {generatedPassword}
                        </code>
                      </div>
                    </div>
                    <div className="py-4">
                      <Separator />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setIsPwdOpen(false);
                        }}
                      >
                        close
                      </Button>

                      <Button variant="default" type="submit">
                        use password
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="pt-3">
              <div className="grid auto-cols-max grid-flow-col gap-x-4">
                <div>
                  <Label>encryption key</Label>
                  <Input {...register("encryptionKey")} type={ekInputType} className="w-[200%]" />
                </div>
                <div className="flex justify-center pl-[600%]">
                  <Button size="icon" variant="link" className="flex justify-center pt-10">
                    {ekInputType === "password" ? (
                      <EyeIcon
                        className="h-4 w-4"
                        onClick={(e) => {
                          e.preventDefault();
                          setEkInputType("text");
                        }}
                      />
                    ) : (
                      <EyeOff
                        className="h-4 w-4"
                        onClick={(e) => {
                          e.preventDefault();
                          setEkInputType("password");
                        }}
                      />
                    )}
                  </Button>
                </div>
              </div>

              {errors.encryptionKey && (
                <p className="pt-2 text-xs text-red-500">{errors.encryptionKey.message}</p>
              )}
              <p className="pt-2 text-xs text-gray-500">
                make sure the encryption key is the same as the one you used to create this site,
                matching the hint you provided. if not, you will not be able to decrypt the
                password.
              </p>

              <EncryptionKeyHint siteId={siteId} />
            </div>

            <div className="flex justify-center pt-3">
              <Button size="lg" type="submit" isLoading={isLoading}>
                create account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
