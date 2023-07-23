import Head from 'next/head';
import React from 'react'

interface PageHeadProps {
  title: string;
  description?: string;
}

export const PageHead: React.FC<PageHeadProps> = ({ title, description }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description ?? "secure password management for everyone"} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
}
