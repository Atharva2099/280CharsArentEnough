import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="280CharsArentEnough - A blog about tech, coding, and more" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" />
        <title>280CharsArentEnough</title>
      </Head>
      <div className="container mt-4">
        <div className="text-center mb-4">
          <h1 className="blog-title">280CharsArentEnough</h1>
        </div>
        {children}
      </div>
    </>
  );
}