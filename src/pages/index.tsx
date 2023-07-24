import { useSession } from "next-auth/react";

import { Navbar } from "@/components/Navbar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { PageHead } from "@/components/PageHead";
import { LandingPage } from "@/components/landing-page/LandingPage";

export default function Home() {
  const { data: sessionData } = useSession();

  return (
    <>
      <PageHead title="warlock" description="secure password management for everyone" />
      <div>
        <div className="flex justify-center">
          <Navbar />
        </div>
        {sessionData?.user ? (
          <div className="flex justify-start pl-16">
            <Dashboard user={sessionData.user} />
          </div>
        ) : (
          <LandingPage />
        )}
      </div>
    </>
  );
}
