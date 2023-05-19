import { type Cover } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { api } from "~/utils/api";

const CommunityPage: NextPage = () => {
  const covers = api.collection.getCommunityCovers.useQuery();

  return (
    <>
      <Head>
        <title>Community Icons</title>
        <meta name="description" content="Your book covers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex min-h-screen flex-col mt-24 px-8 gap-4">
        <h1 className="text-4xl">Community Icons</h1>
        <ul className="grid gap-4 grid-cols-2 sm:grid-cols-4 md:grid-cols-6">
            {
              covers.data?.map((cover: Cover)=> (
                <li key={cover.id}>
                  <Image
                    className="w-full rounded border border-gray-400"
                    width="100"
                    height="100"
                    alt={cover.prompt ?? "an image of a book cover"}
                    src={`https://bookcovergenerator.s3.amazonaws.com/${cover.id}`}
                  />
                </li>
              ))
            }
        </ul>
      </main>
    </>
  );
};

export default CommunityPage;
