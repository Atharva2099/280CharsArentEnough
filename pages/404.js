import Link from 'next/link';
import Layout from '../components/Layout';

export default function Custom404() {
  return (
    <Layout>
      <section className="not-found-shell">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link href="/" className="back-link">
          Back to home
        </Link>
      </section>
    </Layout>
  );
}
