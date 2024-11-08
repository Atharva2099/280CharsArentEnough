import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
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