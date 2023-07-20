import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/Button";

// eslint-disable-next-line
interface CreateSiteProps {}

export const CreateSite: React.FC<CreateSiteProps> = ({}) => {
  const router = useRouter();

  return (
    <div>
      <Button variant="outline" className="w-48 h-32" onClick={() => router.push(`/create`)}>
        add site
      </Button>
    </div>
  );
};
