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
import { cn } from "@/lib/utils";
import type { ExtendedSite } from "@/lib/types";
import { useForm } from "react-hook-form";
import { type SiteRequest, SiteValidator } from "@/lib/validators/site";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/utils/api";

interface EditSiteDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  site: ExtendedSite;
}

const inter = Inter({
  subsets: ["latin"],
});

export const EditSiteDialog: React.FC<EditSiteDialogProps> = ({ isOpen, setIsOpen, site }) => {
  const utils = api.useContext();
  const { mutate: editSite } = api.site.editSite.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SiteRequest>({
    resolver: zodResolver(SiteValidator),
  });

  const onSubmit = (data: SiteRequest) => {
    editSite({ siteId: site.id, encryptionKeyHint: data.encryptionKeyHint, name: data.name });
    setIsOpen(false);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={cn("sm:max-w-[425px]", inter.className)}>
        <DialogHeader>
          <DialogTitle>edit site details</DialogTitle>
          <DialogDescription>make changes to this site here.</DialogDescription>
        </DialogHeader>
        {/* eslint-disable-next-line */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div>
              <Label htmlFor="name" className="text-right">
                site name
              </Label>
              <Input
                // id="name"
                placeholder="eg: facebook"
                defaultValue={site.name}
                className="col-span-3"
                {...register("name")}
              />
              {errors.name && <p className="pt-2 text-xs text-red-500">{errors.name.message}</p>}
            </div>
            <div className="pt-2">
              <Label htmlFor="encryption-key-hint" className="text-right">
                encryption key hint
              </Label>
              <Input
                // id="encryption-key-hint"
                placeholder="my favorite hobby + my age in 2008"
                defaultValue={site.encryptionKeyHint}
                className="col-span-3"
                {...register("encryptionKeyHint")}
              />
              {errors.encryptionKeyHint && (
                <p className="pt-2 text-xs text-red-500">{errors.encryptionKeyHint.message}</p>
              )}
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button type="submit">save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
