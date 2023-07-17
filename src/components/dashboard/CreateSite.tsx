import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/Button";

interface CreateSiteProps {}

export const CreateSite: React.FC<CreateSiteProps> = ({}) => {
  const router = useRouter();

  return (
    <div>
      <Button variant="outline" className="h-48 w-48" onClick={() => router.push(`/create`)}>
        add site
      </Button>
    </div>
  );
};
