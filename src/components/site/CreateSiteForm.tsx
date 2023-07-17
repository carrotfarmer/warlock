import React from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSiteValidator, type CreateSiteFormData } from "@/lib/validators/site";

import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Button } from "../ui/Button";
import { api } from "@/utils/api";

interface CreateSiteFormProps {
  userId: string;
}

export const CreateSiteForm: React.FC<CreateSiteFormProps> = ({ userId }) => {
  const router = useRouter();

  const { mutate: createSite, isLoading } = api.site.createSite.useMutation({
    onSuccess: (data) => {
      router.push(`/${data.id}`);
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateSiteFormData>({
    resolver: zodResolver(CreateSiteValidator),
  });

  const onSubmit = (data: CreateSiteFormData) => {
    createSite({ encryptionKeyHint: data.encryptionKeyHint, name: data.name });
    reset();
  };

  return (
    <div>
      <Card className="max-w-lg">
        <CardContent className="pt-5">
          {/* eslint-disable-next-line */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label>site name</Label>
              <Input placeholder="eg: twitter" {...register("name")} />
              <p className="pt-2 text-xs text-gray-500">
                site name is used to identify your site in the dashboard.
                <br />
                you do not need to use the actual site name or include the url.
              </p>
            </div>

            <div className="pt-3">
              <Label>encryption key</Label>
              <Input {...register("encryptionKey")} />
              <p className="pt-2 text-xs text-red-500">
                NOTE: we do not store your encryption key. if you lose your encryption key, you will
                not be able to access the data related to this site. please keep your encryption key
                safe and configure a good hint. this cannot be updated.
              </p>
            </div>

            <div className="pt-3">
              <Label>encryption key hint</Label>
              <Input
                {...register("encryptionKeyHint")}
                placeholder="eg: my chemistry teacher's name + my cat's birthday"
              />
              <p className="pt-2 text-xs text-gray-500">
                this hint will be shown to you if you forget your encryption key, please configure a
                good, memorable hint.
              </p>
            </div>

            <div className="flex justify-center pt-3">
              <Button size="lg" type="submit" isLoading={isLoading}>
                create site
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
