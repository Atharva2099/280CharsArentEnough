import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Layout({ children }) {
  useEffect(() => {
    function addCopyButtons() {
      document.querySelectorAll('.code-copy-btn').forEach(button => button.remove());
      const codeBlocks = document.querySelectorAll('.blog-post pre');

      codeBlocks.forEach(block => {
        if (window.getComputedStyle(block).position !== 'relative') {
          block.style.position = 'relative';
        }

        const button = document.createElement('button');
        button.className = 'code-copy-btn';
        button.textContent = 'Copy';
        button.setAttribute('aria-label', 'Copy code to clipboard');

        button.addEventListener('click', event => {
          event.stopPropagation();
          const code = block.querySelector('code')?.innerText || '';

          navigator.clipboard.writeText(code)
            .then(() => {
              button.textContent = 'Copied!';
              button.style.background = 'var(--color-magenta)';
              button.style.color = 'var(--color-black)';
              button.style.borderColor = 'var(--color-magenta)';

              setTimeout(() => {
                button.textContent = 'Copy';
                button.style.background = '';
                button.style.color = '';
                button.style.borderColor = '';
              }, 2000);
            })
            .catch(() => {
              button.textContent = 'Error!';
              setTimeout(() => {
                button.textContent = 'Copy';
              }, 2000);
            });
        });

        block.appendChild(button);
      });
    }

    const timeoutId = setTimeout(addCopyButtons, 500);

    return () => {
      clearTimeout(timeoutId);
      document.querySelectorAll('.code-copy-btn').forEach(button => button.remove());
    };
  }, []);

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="280CharsArentEnough - A blog about tech, coding, and research" />
        <title>280CharsArentEnough</title>
      </Head>

      <div className="site-shell">
        <header className="site-header">
          <div className="container site-header-inner">
            <Link href="/" className="brand-link">
              <span className="brand-name">280CharsArentEnough</span>
            </Link>
            <p className="brand-tagline">thoughts too long for a tweet</p>
          </div>
        </header>

        <main className="container site-main">{children}</main>

        <footer className="site-footer">
          <div className="container site-footer-inner">
            <p className="footer-copy">© {new Date().getFullYear()} 280CharsArentEnough</p>
            <nav className="footer-links" aria-label="External links">
              <a href="https://github.com/Atharva2099" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://huggingface.co/Atharva2099" target="_blank" rel="noreferrer">HuggingFace</a>
              <a href="https://atharva2099.github.io" target="_blank" rel="noreferrer">Portfolio</a>
            </nav>
          </div>
        </footer>
      </div>
    </>
  );
}
