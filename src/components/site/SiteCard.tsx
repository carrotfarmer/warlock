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

import { HoverIconButton } from "../HoverIconButton";

import type { ExtendedSite } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Download, Trash2 } from "lucide-react";

interface SiteCardProps {
  site: ExtendedSite;
}

const inter = Inter({ subsets: ["latin"] });

export const SiteCard: React.FC<SiteCardProps> = ({ site }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
        <div className="grid grid-cols-2 gap-5">
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
        </div>
      </CardContent>
    </Card>
  );
};
