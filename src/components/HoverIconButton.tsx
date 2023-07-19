import React from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/Tooltip";
import { Button } from "./ui/Button";

interface HoverIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  buttonProps?: string;
  tooltipText: string;
  variant?: "outline" | "default" | "secondary" | "destructive";
}

export const HoverIconButton: React.FC<HoverIconButtonProps> = ({
  children,
  buttonProps,
  tooltipText,
  variant = "outline",
  ...props
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Button size="sm" variant={variant} className={buttonProps} {...props}>
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
