import Head from 'next/head';
import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="280CharsArentEnough - A blog about tech, coding, and more" />
        <title>280CharsArentEnough</title>
      </Head>
      <div className="container mt-4">
        <header className="text-center mb-5">
          <Link href="/" className="text-decoration-none">
            <h1 className="blog-title">280CharsArentEnough</h1>
          </Link>
          <p className="subtitle">
            Thoughts that don't fit in your average tweet
          </p>
        </header>
        <main>
          {children}
        </main>
      </div>
    </>
  );
}