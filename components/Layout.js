import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Atharv unclogged</title>
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" 
          rel="stylesheet"
        />
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
