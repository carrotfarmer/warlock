import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/Accordion";
import { api } from "@/utils/api";

interface EncryptionKeyHintProps {
  siteId: string;
}

export const EncryptionKeyHint: React.FC<EncryptionKeyHintProps> = ({ siteId }) => {
  const { data: ekData, isLoading } = api.site.getEncryptionKeyHint.useQuery({ siteId });

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>view encryption key hint</AccordionTrigger>
        <AccordionContent>
          <p className="pt-2 text-xs text-gray-500">
            {isLoading ? "loading..." : ekData?.encryptionKeyHint}
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
