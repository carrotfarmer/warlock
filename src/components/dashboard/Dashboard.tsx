import React from "react";
import { Title } from "../Title";
import { CreateSite } from "./CreateSite";

interface DashboardProps {
  userId: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  return (
    <div>
      <Title>
        my sites
      </Title>

      <div className="grid grid-cols-3 pt-5">
        <CreateSite />
      </div>
    </div>
  );
};
