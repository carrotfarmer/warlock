import React from "react";

import { api } from "@/utils/api";

export const Stats: React.FC = () => {
  const { data: stats } = api.user.getUserStats.useQuery();

  return (
    <div className="w-xl flex justify-center">
      <div className="grid grid-cols-2 pt-2">
        <div>
          <div className="text-5xl font-extrabold text-purple-200">{stats?.sitesCount}</div>
          <div>sites</div>
        </div>

        <div>
          <div className="text-5xl font-extrabold text-purple-200">{stats?.accountsCount}</div>
          <div>passwords</div>
        </div>
      </div>
    </div>
  );
};
