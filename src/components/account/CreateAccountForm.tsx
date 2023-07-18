import React from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { api } from "@/utils/api";
import { AccountRequest, AccountValidator } from "@/lib/validators/account";

interface CreateAccountFormProps {
  siteId: string;
}

export const CreateAccountForm: React.FC<CreateAccountFormProps> = ({ siteId }) => {
  const router = useRouter();

  const { mutate: createSite, isLoading } = api.site.createSite.useMutation({
    onSuccess: (data) => {
      router.push(`/${siteId}/${data.id}`);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AccountRequest>({
    resolver: zodResolver(AccountValidator),
  });

  const onSubmit = (data: AccountRequest) => {
    // createSite({ encryptionKeyHint: data.encryptionKeyHint, name: data.name });
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
