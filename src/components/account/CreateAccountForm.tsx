import React from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { api } from "@/utils/api";
import { type AccountFormData, AccountValidator } from "@/lib/validators/account";
import { EncryptionKeyHint } from "../site/EncryptionKeyHint";

import { encrypt } from "@/lib/utils";

interface CreateAccountFormProps {
  siteId: string;
}

export const CreateAccountForm: React.FC<CreateAccountFormProps> = ({ siteId }) => {
  const router = useRouter();

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
  } = useForm<AccountFormData>({
    resolver: zodResolver(AccountValidator),
  });

  const onSubmit = (data: AccountFormData) => {
    const encryptedPassword = encrypt(data.password, data.encryptionKey);

    createAccount({ siteId, encryptedPassword, email: data.email })
    reset();
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
              {errors.email && (
                <p className="pt-2 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
              <p className="pt-2 text-xs text-gray-500">
                the email is just for your reference. you do not need to include it, if you don&apos;t feel comfortable with it.
              </p>
            </div>

            <div className="pt-3">
              <Label>password</Label>
              <Input
                {...register("password")}
                type="password"
              />
              {errors.password && (
                <p className="pt-2 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
              <p className="pt-2 text-xs text-gray-500">
                this password will be encrypted using this site&apos;s encryption key. 
              </p>
            </div>

            <div className="pt-3">
              <Label>encryption key</Label>
              <Input
                {...register("encryptionKey")}
                type="password"
              />
              {errors.encryptionKey && (
                <p className="pt-2 text-xs text-red-500">
                  {errors.encryptionKey.message}
                </p>
              )}
              <p className="pt-2 text-xs text-gray-500">
                make sure the encryption key is the same as the one you used to create this site, matching the hint you provided.
                if not, you will not be able to decrypt the password.
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
}
