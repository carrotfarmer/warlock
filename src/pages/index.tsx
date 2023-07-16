import Head from "next/head";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div>
      <Head>
        <title>warlock</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-center">
        <Navbar />
      </div>
    </div>
  );
}
