import Head from "next/head";
import { Navbar } from "@/components/Navbar";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: sessionData } = useSession();

  return (
    <div>
      <Head>
        <title>warlock</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-center">
        <Navbar />
      </div>
      {/* a div aligned to the left for the dashboard */}
      {sessionData?.user ? (
        <div className="flex justify-start pl-16">
          <Dashboard userId={sessionData.user.id} />
        </div>
      ) : (
        <p>landing page goes here</p>
      )}
    </div>
  );
}
