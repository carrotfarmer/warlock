import React from "react";
import { Title } from "../Title";
import { CreateSite } from "./CreateSite";
import { api } from "@/utils/api";
import { SiteCard } from "../site/SiteCard";
import type { User } from "next-auth";

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { data: sitesData, isLoading } = api.site.getSites.useQuery();

  return (
    <div>
      <Title>my sites</Title>

      <div className="grid grid-cols-5 gap-5 pr-16 pt-5">
        {sitesData &&
          sitesData.map((site) => (
            <div key={site.id}>
              <SiteCard site={site} />
            </div>
          ))}

        <div>
          <CreateSite />
        </div>
      </div>
    </div>
  );
};
