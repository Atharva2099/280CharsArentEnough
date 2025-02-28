import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Layout({ children }) {
  useEffect(() => {
    function addCopyButtons() {
      // First, remove any existing copy buttons to avoid duplicates
      document.querySelectorAll('.code-copy-btn').forEach(btn => btn.remove());
      
      const codeBlocks = document.querySelectorAll('.blog-post pre');
      
      codeBlocks.forEach(block => {
        // Position the pre element relatively if it's not already
        if (window.getComputedStyle(block).position !== 'relative') {
          block.style.position = 'relative';
        }
        
        // Create button
        const button = document.createElement('button');
        button.className = 'code-copy-btn';
        button.textContent = 'Copy';
        button.setAttribute('aria-label', 'Copy code to clipboard');
        
        // Add click handler
        button.addEventListener('click', (e) => {
          // Prevent the click from being triggered multiple times
          e.stopPropagation();
          
          const code = block.querySelector('code')?.innerText || '';
          
          navigator.clipboard.writeText(code)
            .then(() => {
              button.textContent = 'Copied!';
              button.style.background = '#28a745';
              button.style.color = 'white';
              
              setTimeout(() => {
                button.textContent = 'Copy';
                button.style.background = '';
                button.style.color = '';
              }, 2000);
            })
            .catch(() => {
              button.textContent = 'Error!';
              setTimeout(() => {
                button.textContent = 'Copy';
              }, 2000);
            });
        });
        
        // Add to DOM
        block.appendChild(button);
      });
    }

    // Remove any default browser "Copy" button that might be added automatically
    function removeDefaultCopyButtons() {
      // Look for any buttons at the bottom of pre elements
      document.querySelectorAll('.blog-post pre button:not(.code-copy-btn)').forEach(btn => {
        if (btn.textContent.toLowerCase().includes('copy')) {
          btn.remove();
        }
      });
    }

    // Run after initial render with a slight delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      addCopyButtons();
      removeDefaultCopyButtons();
    }, 500);
    
    // Clean up
    return () => {
      clearTimeout(timeoutId);
      document.querySelectorAll('.code-copy-btn').forEach(btn => btn.remove());
    };
  }, []);

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
            Thoughts that don&apos;t fit in your average tweet
          </p>
        </header>
        <main>
          {children}
        </main>
      </div>
    </>
  );
}