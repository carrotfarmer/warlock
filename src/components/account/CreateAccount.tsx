import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "../ui/Button";

interface CreateAccountProps {
  siteId: string;
}

export const CreateAccount: React.FC<CreateAccountProps> = ({ siteId }) => {
  const router = useRouter();

  return (
    <div className="pt-5">
      <Button variant="outline" onClick={() => router.push(`/${siteId}/create`)}>
        create account
      </Button>
    </div>
  );
};
