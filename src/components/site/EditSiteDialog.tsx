import React, { type Dispatch, type SetStateAction } from 'react'

import { Button } from "@/components/ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"

interface EditSiteDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const EditSiteDialog: React.FC<EditSiteDialogProps> = ({ isOpen, setIsOpen }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>edit site details</DialogTitle>
          <DialogDescription>
            make changes to this site here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              site name
            </Label>
            <Input id="name" placeholder="eg: facebook" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="encryption-key-hint" className="text-right">
              encryption key hint
            </Label>
            <Input id="encryption-key-hint" placeholder="my favorite hobby + my age in 2008" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog> 
  );
}
