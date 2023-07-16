import React from "react";
import { DashboardTitle } from "./DashboardTitle";

interface DashboardProps {
  userId: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  return <div><DashboardTitle /></div>;
};
