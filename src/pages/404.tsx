import type { NextPage } from "next";

import { PageHead } from "@/components/PageHead";
import { Title } from "@/components/Title";

import { XOctagon } from "lucide-react";

const NotFound: NextPage = () => {
  return (
    <>
      <PageHead title="404 page not found - warlock" />
      <div className="flex h-full w-full flex-col items-center justify-center pt-[15%]">
        <XOctagon className="h-20 w-20 text-red-300" />
        <Title>404 not found</Title>
        <p className="pt-2 text-center">
          the page you are looking for does not exist. what are you doing?
        </p>
      </div>
    </>
  );
};

export default NotFound;
