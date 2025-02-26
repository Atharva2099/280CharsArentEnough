import { useEffect } from 'react';

export default function CodeCopyButton() {
  useEffect(() => {
    function addCopyButtons() {
      const codeBlocks = document.querySelectorAll('.blog-post pre');
      
      codeBlocks.forEach(block => {
        // Only add button if it doesn't already have one
        if (block.querySelector('.code-copy-btn')) return;
        
        // Position the pre element relatively
        block.style.position = 'relative';
        
        // Create button
        const button = document.createElement('button');
        button.className = 'code-copy-btn';
        button.textContent = 'Copy';
        button.setAttribute('aria-label', 'Copy code to clipboard');
        
        // Add click handler
        button.addEventListener('click', () => {
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

    // Run after initial render and wait for code blocks to be ready
    setTimeout(addCopyButtons, 500);
    
    // Clean up
    return () => {
      document.querySelectorAll('.code-copy-btn').forEach(btn => btn.remove());
    };
  }, []);

  // This component doesn't render anything
  return null;
}