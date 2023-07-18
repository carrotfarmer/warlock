import React from "react";
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { buttonVariants } from "../ui/Button";

import type { ExtendedSite } from "@/lib/types";
import { cn } from "@/lib/utils";

import { Download } from "lucide-react";

interface SiteCardProps {
  site: ExtendedSite;
}

export const SiteCard: React.FC<SiteCardProps> = ({ site }) => {
  return (
    <Card className="max-w-xl">
      <CardHeader className="grid grid-cols-2 space-x-14">
        <Link href={`/${site.id}`}>
          <CardTitle className="pt-2 underline underline-offset-4 hover:text-purple-300">
            {site.name}
          </CardTitle>
        </Link>
        <div className="h-6 w-8 rounded-md bg-gray-800">
          <p className="flex justify-center font-semibold">{site.accounts.length}</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-5">
          <button className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            <Download className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
