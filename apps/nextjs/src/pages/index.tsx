import Navbar from "@/components/Navbar";
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Childcare</title>
        <meta name="description" content="Stepping stones childcare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main>
      </main>
    </>
  );
};

export default Home;
