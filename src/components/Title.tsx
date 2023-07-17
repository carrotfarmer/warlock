import React from "react";

interface TitleProps {
  children: React.ReactNode;
}

export const Title: React.FC<TitleProps> = ({ children }) => {
  return (
    <div className="pt-5">
      <h1 className="text-4xl font-extrabold text-purple-200">{children}</h1>
    </div>
  );
};
