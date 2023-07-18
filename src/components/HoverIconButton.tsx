import React from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/Tooltip";
import { Button } from "./ui/Button";

interface HoverIconButtonProps {
  children: React.ReactNode;
  buttonProps?: string;
  tooltipText: string;
}

export const HoverIconButton: React.FC<HoverIconButtonProps> = ({
  children,
  buttonProps,
  tooltipText,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button size="sm" variant="outline" className={buttonProps}>
            {children}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
